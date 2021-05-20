'use strict'
const zb = require("zeebe-node");
const uuid = require("uuid");


module.exports = async (context, req) => {
  const result = {
    'body': JSON.stringify(req.body),
    'content-type': req.headers["content-type"]
  }

  const method = req.method;
  const { data, zeebe_credentials } = req.body
  /**
   * Only POST requests
   */
  switch (method) {
    case 'POST':

      const { workflow_id } = data;

      //const orderid = "2251799814795697"; //workflow_id;

      const zbc = new zb.ZBClient(zeebe_credentials, { loglevel: 'INFO' });

      console.log(workflow_id)
      const mess = await zbc.publishMessage({
        correlationKey: workflow_id,
        messageId: uuid.v4(),
        name: 'Message_ProcessPay',
        variables: { valueToAddToWorkflowVariables: 'here', status: 'PROCESSED' },
        timeToLive: zb.Duration.seconds.of(1), // seconds
      });

      return {
        status: 200,
        body: { res: data, mess },
        headers: {
            'Content-Type': 'application/json'
        }
    };
default:
    return {
        status: 405,
        body: { res: false },
        headers: {
            'Content-Type': 'application/json'
        }
    };

  }

}
