# Jaeger & OpenTelemetry

This directory supports the use of open-telemetry by running Jaeger and data collection in docker for local testing.

## Running with telemetry

Run the following script from the root of this repository:

```bash
$ yarn trace
```

To shutdown the docker images, run the following:

```bash
$ yarn jaeger:stop
```

## To view the metrics

The console will print the telemetry address as well, but just open the following url once the service is running:

- http://localhost:16686

## Using in the service

To create a span in telemetry you can use `context.logger.span` as follows:

```Typescript
async function example(context: ApiContext): Promise<boolean> {
  return await context.logger.span("Name of Task", { dataKey: "key-value-data" }, async() => {
    await new Promise((done) => setTimeout(done, 1));
    return true;
  });
}
```

## Documentation Links:

- https://opentelemetry.io/
- https://www.jaegertracing.io/docs/1.6/getting-started/
- https://github.com/open-telemetry
