# Promise Queue

This is a simple module to handle running a queue of functions, with optional concurrency limits.

## Installation

    npm install promisequeue

## Usage

**Parameters**:

* `queue`: An array of functions, each of which must return a promise
* `options`: An optional array containing configuration options

A call to Promise Queue will return a promise that will be fulfilled when all jobs are complete.

The `options` parameter has two values:

* `concurrency`: The maximum number of jobs to run simultaneously. If not set, then no limit is applied.
* `abortOnReject`: If set, a job rejecting it's promise will result in the queue's promise being rejected. Default is false.
