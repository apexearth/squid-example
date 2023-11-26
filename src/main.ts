import {processor} from './processor'
import {TypeormDatabase} from '@subsquid/typeorm-store';
import * as oethAbi from './abi/oeth'
import * as chainlinkAbi from './abi/chainlink-feed-registry'
import {BalanceIncrease} from './model';

const oethAddress = '0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3' // lowercase
const accounts = [ // randomly picked addresses
  '0xbb0b2734e54f74ace27645097ba33a4a19c56be4',
  '0xc7ad94376b7117dfd68e0e5c50ce189dd3fb55e9'
]
const chainlinkFeedRegistryAddress = '0x47fb2585d2c56fe188d0e6ec628a38b74fceeedf'

processor.run(new TypeormDatabase(), async (ctx) => {
  const balanceIncreases: BalanceIncrease[] = []
  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      if (
        log.address === oethAddress &&
        log.topics[0] === oethAbi.events.TotalSupplyUpdatedHighres.topic
      ) {
        // Any TotalSupplyUpdatedHighres event that comes in means all addresses have had their balance changed.
        const previous = new oethAbi.Contract(ctx, { height: block.header.height - 1 }, oethAddress)
        const current = new oethAbi.Contract(ctx, block.header, oethAddress)
        const chainlink = new chainlinkAbi.Contract(ctx, block.header, chainlinkFeedRegistryAddress)
        const entities = await Promise.all(accounts.map(async account => {
          const [previousBalance, currentBalance, ethUsdRate] = await Promise.all([
            previous.balanceOf(account),
            current.balanceOf(account),
            chainlink.latestAnswer('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', '0x0000000000000000000000000000000000000348')
          ])
          const amount = currentBalance - previousBalance
          const amountUsd = amount * ethUsdRate / 1_000_000_000_000_000_000n
          return new BalanceIncrease({
            id: `${log.id}:${account}`,
            blockNumber: block.header.height,
            blockTimestamp: new Date(block.header.timestamp),
            address: oethAddress,
            account: account,
            amount, // 18 decimal bigint
            amountUsd // 6 decimal bigint
          })
        }))
        balanceIncreases.push(...entities)
      }
    }
  }
  await ctx.store.insert(balanceIncreases.filter(bi => bi.amount > 0))
})
