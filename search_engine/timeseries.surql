-- Time Range Search using SurrealDB

-- Usage with datetime as Record ID (composite)
-- Format: ["entity_name", datetime]

-- Events table
DEFINE TABLE events SCHEMAFULL;
DEFINE FIELD entity ON events TYPE record(entities);
DEFINE FIELD value ON events TYPE any;
DEFINE FIELD type ON events TYPE string;  -- event, metric
DEFINE FIELD source ON events TYPE string;

-- Time-range search function
DEFINE FUNCTION fn::time_range($entity_name, $start, $end, $limit)
BEGIN
  LET start_time = time::parse($start, "ISO8601");
  LET end_time = time::parse($end, "ISO8601");
  
  -- Query by ID range
  LET results = SELECT * FROM events 
    WHERE id >= [$entity_name, start_time]
    AND id <= [$entity_name, end_time]
    ORDER BY id DESC
    LIMIT $limit;
  
  RETURN results;
END;

-- Latest value
DEFINE FUNCTION fn::latest($entity_name)
BEGIN
  RETURN SELECT * FROM events 
    WHERE id[0] = $entity_name
    ORDER BY id[1] DESC
    LIMIT 1;
END;

-- Average value
DEFINE FUNCTION fn::average($entity_name, $start, $end)
BEGIN
  LET results = fn::time_range($entity_name, $start, $end, 1000);
  
  LET sum = 0;
  LET count = 0;
  
  FOR event IN results DO
    IF (event.value != none) THEN
      sum += event.value;
      count += 1;
    END
  END
  
  IF (count > 0) THEN
    RETURN sum / count;
  END
  
  RETURN 0;
END;

-- Aggregate by time bucket
DEFINE FUNCTION fn::aggregate($entity_name, $start, $end, $bucket)
BEGIN
  LET results = fn::time_range($entity_name, $start, $end, 10000);
  
  LET buckets = {};
  
  FOR event IN results DO
    LET ts = event.id[1];
    LET key = match $bucket
      WHEN "hour" THEN time::format(ts, "%Y-%m-%d %H:00")
      WHEN "day" THEN time::format(ts, "%Y-%m-%d")
      WHEN "week" THEN time::format(ts, "%Y-W%W")
      WHEN "month" THEN time::format(ts, "%Y-%m")
    END;
    
    IF (buckets.keys().contains(key)) THEN
      buckets[key].count += 1;
      buckets[key].sum += event.value;
    ELSE
      buckets[key] = { count: 1, sum: event.value };
    END
  END
  
  RETURN buckets;
END;

-- Live query (real-time)
-- SELECT * FROM events WHERE entity = $entity_name LIVE;
