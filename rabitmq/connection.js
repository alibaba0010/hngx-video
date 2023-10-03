import amqplib from "amqplib";

const AMQP_URL = "amqp://guest:guest@localhost:5672/";
const AMQP_QUEUE_NAME = "video_queue";

export function connectRabbitMQ() {
  console.log("Connecting to rabbit mq...");
  amqplib.connect(AMQP_URL, async (err, connection) => {
    if (err) {
      console.log("This log doesn't print");
      throw err;
    }
    console.log("This log doesn't print");

    // Listener
    const channel1 = await connection.createChannel();
    channel1.consume(AMQP_QUEUE_NAME, (msg) => {
      if (msg !== null) {
        console.log("message: ", msg);
        console.log("Recieved:", msg.content.toString());
        channel1.ack(msg);
      } else {
        console.log("Consumer cancelled by server");
      }
    });

    // Sender
    const channel2 = await connection.createChannel();
    setInterval(() => {
      channel2.sendToQueue(AMQP_QUEUE_NAME, Buffer.from("something"));
    }, 1000);
  });
}
