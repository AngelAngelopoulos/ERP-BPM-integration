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

      const { workflow_id, receive } = data;

      //const orderid = "2251799814795697"; //workflow_id;

      const zbc = new zb.ZBClient(zeebe_credentials, { loglevel: 'INFO' });

      console.log(workflow_id)
      const mess = await zbc.publishMessage({
        correlationKey: workflow_id,
        messageId: uuid.v4(),
        name: 'Message_CheckReceive',
        variables: { receive: receive ,valueToAddToWorkflowVariables: 'here', status: 'PROCESSED' },
        timeToLive: zb.Duration.seconds.of(1), // seconds
      });

      return context.succeed({ res: data, mess });
      break;
    default:
      return context.status(405).succeed({ res: false });
      break;
  }
}
