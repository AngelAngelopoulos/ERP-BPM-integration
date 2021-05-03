'use strict'
const zb = require("zeebe-node");
const uuid = require("uuid");


module.exports = async (event, context) => {
  const result = {
    'body': JSON.stringify(event.body),
    'content-type': event.headers["content-type"]
  }

  const method = event.method;
  const { data, zeebe_credentials } = event.body
  /**
   * Only POST requests
   */
  switch (method) {
    case 'POST':

      const zbc = new zb.ZBClient(zeebe_credentials, { loglevel: 'INFO' });
      const orderid = uuid.v4()

      // DECLARATION OF ANY PROCESS:
      zbc.createWorker('order-activity', async (job, complete) => {
        const { key, variables } = job;
        console.info(`* Starting Order...: ${variables}`);
        //const stock = 100; //Aqui se revisa el stock con una request
        complete.success({variables: variables, orderid: orderid });
        console.info(`* Passing to next task: ${variables}`);
      });


      //const newsbc = createWorkers(zbc);
      const wfi = await zbc.createWorkflowInstance("process-orders", data);
      wfi.orderid = orderid;
      context.succeed({ res: data , wfi });
      break;
    default:
      context.status(405).succeed({ res: false });
      break;
  }

  return context
    .succeed(result)
}
