import axios from 'axios'

const serverApi = 'http://localhost:5002/api'

export const getRoomExists = async (roomId) => {
  const res = await axios.get(`${serverApi}/room-exists/${roomId}`)
  return res.data
}
