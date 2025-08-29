export const Migration_query = `
    CREATE TABLE market_ticks (
    time TIMESTAMPTZ NOT NULL,
    price DOUBLE PRECISION
);
`;

export const OneMinCandle = `
    CREATE MATERIALIZED VIEW candles_1min AS
SELECT
    time_bucket('1 minute', time) AS bucket,
    first(price, time) AS open,
    MAX(price) AS high,
    MIN(price) AS low,
    last(price, time) AS close
FROM market_ticks
GROUP BY bucket
ORDER BY bucket DESC;
`

export const FiveMinCandle = `
    CREATE MATERIALIZED VIEW candles_5min AS
SELECT
    time_bucket('5 minutes', time) AS bucket,
    first(price, time) AS open,
    MAX(price) AS high,
    MIN(price) AS low,
    last(price, time) AS close
FROM market_ticks
GROUP BY bucket
ORDER BY bucket DESC;
`

export const FivteenMinCandle = `
    CREATE MATERIALIZED VIEW candles_15min AS
SELECT
    time_bucket('15 minutes', time) AS bucket,
    first(price, time) AS open,
    MAX(price) AS high,
    MIN(price) AS low,
    last(price, time) AS close
FROM market_ticks
GROUP BY bucket
ORDER BY bucket DESC;
`
export const ThirtyMinCandle = `
    CREATE MATERIALIZED VIEW candles_30min AS
SELECT
    time_bucket('30 minutes', time) AS bucket,
    first(price, time) AS open,
    MAX(price) AS high,
    MIN(price) AS low,
    last(price, time) AS close
FROM market_ticks
GROUP BY bucket
ORDER BY bucket DESC;

`
export const OneHourCandle = `
    CREATE MATERIALIZED VIEW candles_1hour AS
SELECT
    time_bucket('1 hour', time) AS bucket,
    first(price, time) AS open,
    MAX(price) AS high,
    MIN(price) AS low,
    last(price, time) AS close
FROM market_ticks
GROUP BY bucket
ORDER BY bucket DESC;

`