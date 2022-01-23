import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://api.vdsm-20h.online'
  }
)

const useApi = () => {
  const createMeeting = async () => {
    const response = await instance.post('/jitsi/create')
    if (response.status === 200){
      return response.data;
    }
  }

  const invite = async () => {
    const response = await instance.post('/jitsi/invite')
    if (response.status === 200){
      return response.data
    }
  }

  return {
    createMeeting,
    invite
  }
}

export default useApi