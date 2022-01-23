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
    //TODO: error handling
  }

  const createInvite = async (jwt) => {
    const response = await instance.post('/jitsi/invite', null, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
    if (response.status === 200){
      return response.data
    }
    //TODO: error handling
  }

  const getInfoByAlias = async (alias) =>{
    const response = await instance.get('/jitsi/' + alias)
    if (response.status === 200){
      return response.data
    }
  }

  return {
    createMeeting,
    createInvite,
    getInfoByAlias
  }
}

export default useApi