import Bottleneck from "bottleneck"

const limiter = new Bottleneck({ minTime: 1000 })

export default limiter
