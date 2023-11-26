import {
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  BlockHeader,
  Log as _Log,
  Transaction as _Transaction
} from '@subsquid/evm-processor'
import {lookupArchive} from '@subsquid/archive-registry'
import * as contractAbi from './abi/oeth'

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet', {type: 'EVM'}),
    chain: {
      url: process.env.RPC_ENDPOINT!
    }
  })
  .setFinalityConfirmation(10)
  .setFields({
    log: {
      topics: true,
      data: true,
    }
  })
  .addLog({
    address: ['0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3'],
    topic0: [
      contractAbi.events.TotalSupplyUpdatedHighres.topic,
    ],
    range: {
      from: 16933090,
    },
  })

export type Fields = EvmBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
