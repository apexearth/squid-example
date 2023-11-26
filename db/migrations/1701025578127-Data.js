module.exports = class Data1701025578127 {
    name = 'Data1701025578127'

    async up(db) {
        await db.query(`CREATE TABLE "balance_increase" ("id" character varying NOT NULL, "block_number" integer, "block_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "address" text NOT NULL, "account" text NOT NULL, "amount" numeric NOT NULL, "amount_usd" numeric NOT NULL, CONSTRAINT "PK_c568cf34e775ae3ce23666d6fab" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_8d25bed3bfb0d786708bddb488" ON "balance_increase" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_1762dead947022e07e8127538e" ON "balance_increase" ("block_timestamp") `)
        await db.query(`CREATE INDEX "IDX_4e7a9b9f403feca91cc91107d3" ON "balance_increase" ("address") `)
        await db.query(`CREATE INDEX "IDX_4daec8e317a9e664702394fdf1" ON "balance_increase" ("account") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "balance_increase"`)
        await db.query(`DROP INDEX "public"."IDX_8d25bed3bfb0d786708bddb488"`)
        await db.query(`DROP INDEX "public"."IDX_1762dead947022e07e8127538e"`)
        await db.query(`DROP INDEX "public"."IDX_4e7a9b9f403feca91cc91107d3"`)
        await db.query(`DROP INDEX "public"."IDX_4daec8e317a9e664702394fdf1"`)
    }
}
