import axios from "axios"
import Bottleneck from "bottleneck"

const limiter = new Bottleneck({ minTime: 1000 })

export const get = limiter.wrap(axios.get)
