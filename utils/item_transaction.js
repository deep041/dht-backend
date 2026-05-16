const buildEntry = ({
    itemId,
    action,
    sourceModule,
    sourceId,
    sourceLineItemId = null,
    qty = null,
    rate = null,
    unitId = null
}) => ({
    itemId: Number(itemId),
    action,
    sourceModule,
    sourceId: Number(sourceId),
    sourceLineItemId: sourceLineItemId ? Number(sourceLineItemId) : null,
    qty: qty != null ? Number(qty) : null,
    rate: rate != null ? Number(rate) : null,
    unitId: unitId ? Number(unitId) : null
});

const lineItemsWithItemId = (lineItems = []) =>
    lineItems.filter((line) => line?.itemId != null);

const logItemTransactions = async (prisma, entries) => {
    if (!entries?.length) return;

    await prisma.itemTransaction.createMany({
        data: entries
    });
};

const logLineItemsOnCreate = async (prisma, { sourceModule, sourceId, lineItems }) => {
    const entries = lineItemsWithItemId(lineItems).map((line) =>
        buildEntry({
            itemId: line.itemId,
            action: 'ADD',
            sourceModule,
            sourceId,
            sourceLineItemId: line.id,
            qty: line.qty,
            rate: line.rate,
            unitId: line.unitId
        })
    );

    await logItemTransactions(prisma, entries);
};

const logLineItemsOnUpdate = async (
    prisma,
    { sourceModule, sourceId, previousLineItems = [], newLineItems = [] }
) => {
    const previous = lineItemsWithItemId(previousLineItems);
    const next = lineItemsWithItemId(newLineItems);
    const nextByItemId = new Map(next.map((line) => [Number(line.itemId), line]));
    const entries = [];

    for (const line of previous) {
        const itemId = Number(line.itemId);

        if (!nextByItemId.has(itemId)) {
            entries.push(
                buildEntry({
                    itemId,
                    action: 'DELETE',
                    sourceModule,
                    sourceId,
                    sourceLineItemId: line.id,
                    qty: line.qty,
                    rate: line.rate,
                    unitId: line.unitId
                })
            );
        }
    }

    const previousByItemId = new Map(previous.map((line) => [Number(line.itemId), line]));

    for (const line of next) {
        const itemId = Number(line.itemId);
        const action = previousByItemId.has(itemId) ? 'UPDATE' : 'ADD';

        entries.push(
            buildEntry({
                itemId,
                action,
                sourceModule,
                sourceId,
                sourceLineItemId: line.id,
                qty: line.qty,
                rate: line.rate,
                unitId: line.unitId
            })
        );
    }

    await logItemTransactions(prisma, entries);
};

const logLineItemsOnDelete = async (prisma, { sourceModule, sourceId, lineItems }) => {
    const entries = lineItemsWithItemId(lineItems).map((line) =>
        buildEntry({
            itemId: line.itemId,
            action: 'DELETE',
            sourceModule,
            sourceId,
            sourceLineItemId: line.id,
            qty: line.qty,
            rate: line.rate,
            unitId: line.unitId
        })
    );

    await logItemTransactions(prisma, entries);
};

const logItemMasterOnCreate = async (prisma, item) => {
    await logItemTransactions(prisma, [
        buildEntry({
            itemId: item.id,
            action: 'ADD',
            sourceModule: 'ITEM',
            sourceId: item.id,
            qty: item.minStockQty,
            rate: item.sellingRate,
            unitId: item.unitId
        })
    ]);
};

module.exports = {
    logItemTransactions,
    logLineItemsOnCreate,
    logLineItemsOnUpdate,
    logLineItemsOnDelete,
    logItemMasterOnCreate
};
