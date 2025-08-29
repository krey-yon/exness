--migration
CREATE TABLE market_ticks (
    time TIMESTAMPTZ NOT NULL,
    price_int BIGINT NOT NULL
);

--creating hypertable
SELECT create_hypertable('market_ticks', 'time');


-- Rewrite Views as Continuous Aggregate

CREATE MATERIALIZED VIEW candles_1min
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 minute', time) AS bucket,
    first(price, time) AS open,
    MAX(price) AS high,
    MIN(price) AS low,
    last(price, time) AS close
FROM market_ticks
GROUP BY bucket;

CREATE MATERIALIZED VIEW candles_5min
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('5 minutes', time) AS bucket,
    first(price, time) AS open,
    MAX(price) AS high,
    MIN(price) AS low,
    last(price, time) AS close
FROM market_ticks
GROUP BY bucket;

CREATE MATERIALIZED VIEW candles_15min
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('15 minutes', time) AS bucket,
    first(price, time) AS open,
    MAX(price) AS high,
    MIN(price) AS low,
    last(price, time) AS close
FROM market_ticks
GROUP BY bucket;

CREATE MATERIALIZED VIEW candles_30min
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('30 minutes', time) AS bucket,
    first(price, time) AS open,
    MAX(price) AS high,
    MIN(price) AS low,
    last(price, time) AS close
FROM market_ticks
GROUP BY bucket;

CREATE MATERIALIZED VIEW candles_1hour
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 hour', time) AS bucket,
    first(price, time) AS open,
    MAX(price) AS high,
    MIN(price) AS low,
    last(price, time) AS close
FROM market_ticks
GROUP BY bucket;


-- Add Refresh Policies

-- 1 minute candles, refresh every minute, keep last 1 day rolling
SELECT add_continuous_aggregate_policy('candles_1min',
    start_offset => INTERVAL '1 day',
    end_offset   => INTERVAL '1 minute',
    schedule_interval => INTERVAL '1 minute');

-- 5 minute candles, refresh every 5 minutes, keep last 7 days
SELECT add_continuous_aggregate_policy('candles_5min',
    start_offset => INTERVAL '7 days',
    end_offset   => INTERVAL '5 minutes',
    schedule_interval => INTERVAL '5 minutes');

-- 15 minute candles, refresh every 15 minutes, keep last 14 days
SELECT add_continuous_aggregate_policy('candles_15min',
    start_offset => INTERVAL '14 days',
    end_offset   => INTERVAL '15 minutes',
    schedule_interval => INTERVAL '15 minutes');

-- 30 minute candles, refresh every 30 minutes, keep last 30 days
SELECT add_continuous_aggregate_policy('candles_30min',
    start_offset => INTERVAL '30 days',
    end_offset   => INTERVAL '30 minutes',
    schedule_interval => INTERVAL '30 minutes');

-- 1 hour candles, refresh every 1 hour, keep last 90 days
SELECT add_continuous_aggregate_policy('candles_1hour',
    start_offset => INTERVAL '90 days',
    end_offset   => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour');





--new schema m view
CREATE MATERIALIZED VIEW candles_1min
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 minute', time) AS bucket,
    first(price_int, time) AS open,
    MAX(price_int) AS high,
    MIN(price_int) AS low,
    last(price_int, time) AS close
FROM market_ticks
GROUP BY bucket;

CREATE MATERIALIZED VIEW candles_5min
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('5 minutes', time) AS bucket,
    first(price_int, time) AS open,
    MAX(price_int) AS high,
    MIN(price_int) AS low,
    last(price_int, time) AS close
FROM market_ticks
GROUP BY bucket;

CREATE MATERIALIZED VIEW candles_15min
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('15 minutes', time) AS bucket,
    first(price_int, time) AS open,
    MAX(price_int) AS high,
    MIN(price_int) AS low,
    last(price_int, time) AS close
FROM market_ticks
GROUP BY bucket;

CREATE MATERIALIZED VIEW candles_30min
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('30 minutes', time) AS bucket,
    first(price_int, time) AS open,
    MAX(price_int) AS high,
    MIN(price_int) AS low,
    last(price_int, time) AS close
FROM market_ticks
GROUP BY bucket;

CREATE MATERIALIZED VIEW candles_1hour
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 hour', time) AS bucket,
    first(price_int, time) AS open,
    MAX(price_int) AS high,
    MIN(price_int) AS low,
    last(price_int, time) AS close
FROM market_ticks
GROUP BY bucket;
