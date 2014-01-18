/**
 * A module for running an array of promise returning functions.
 * @module simple-queue
 */

var Promise = require( "promise" )

/**
 * Function to process queues. Returns a promise for queue completion.
 * @param {array} queue - An array of functions which return promises
 * @param {object} options - Options for the queue
 */
function queue( queue, options ){
  return Promise( function( resolve, reject ){

    // Determine concurrency limit
    if( !options ){
      options = {}
    }
    var limit = queue.length
    if( options.concurrency ){
      limit = options.concurrency
    }

    // Track existence of queue promise rejections
    haveRejections = false

    /**
     * Run the next task, until the queue is done
     */
    var jobCount = queue.length
    var jobsDone = 0
    function next(){

      if( jobCount > jobsDone && !( haveRejections && options.abortOnReject ) ){
        // Queue has stuff, and its not time to reject
        var task = queue.pop()()
        task.then( function fulfilled(){
          jobsDone += 1
          next()
        }, function rejected(){
          haveRejections = true
          jobsDone += 1
          next()
        } )
      } else if( haveRejections && options.abortOnReject ){
        // Bail out early
        reject()
      } else {
        // All work done
        resolve()
      }

    }

    // Start concurrent jobs
    for( var i = 0; i < limit; i += 1 ){
      next()
    }

  } )
}

module.exports = queue
