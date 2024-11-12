export function FailurebyStatebyYear(data) {
    const failureCounts = data.reduce((acc, cur) => {
        const state = cur.STATE;
        const year = cur.FAILDATE.split('/')[2]; // Assuming the date format is MM/DD/YYYY

        if (!acc[state]) {
            acc[state] = {};
        }

        if (acc[state][year]) {
            acc[state][year] += 1; // Increment the count of failures for the existing year
        } else {
            acc[state][year] = 1; // Initialize the count of failures for a new year
        }

        return acc;
    }, {});

    return failureCounts;
}

export function CharterPercentagebyStatebyYear(data) {
    const result = {};
    data.forEach(item => {
        const state = item.STATE;
        const year = item.FAILDATE.split('/')[2];
        const charter = item.CHARTER;
        if (!result[state]) {
            result[state] = {};
        }
        if (!result[state][year]) {
            result[state][year] = {};
        }
        if (result[state][year][charter]) {
            result[state][year][charter] += 1;
        } else {
            result[state][year][charter] = 1;
        }
    });

    // Convert counts to percentages
    Object.keys(result).forEach(state => {
        Object.keys(result[state]).forEach(year => {
            const total = Object.values(result[state][year]).reduce((sum, count) => sum + count, 0);
            Object.keys(result[state][year]).forEach(charter => {
                result[state][year][charter] = (result[state][year][charter] / total) * 100;
            });
        });
    });

    return result;
}

export function AssetAndDepositbyStatebyYear(data) {
    const result = {};
    data.forEach(item => {
        const state = item.STATE;
        const year = item.FAILDATE.split('/')[2];
        if (!result[state]) {
            result[state] = {};
        }
        if (!result[state][year]) {
            result[state][year] = { totalAsset: 0, totalDeposit: 0, count: 0 };
        }
        result[state][year].totalAsset += item.ASSET;
        result[state][year].totalDeposit += item.DEPOSIT;
        result[state][year].count += 1;
    });

    // Average assets and deposits
    Object.keys(result).forEach(state => {
        Object.keys(result[state]).forEach(year => {
            if (result[state][year].count > 0) {
                result[state][year].averageAsset = result[state][year].totalAsset / result[state][year].count;
                result[state][year].averageDeposit = result[state][year].totalDeposit / result[state][year].count;
            } else {
                result[state][year].averageAsset = 0;
                result[state][year].averageDeposit = 0;
            }
        });
    });

    return result;
}