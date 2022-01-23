import axios from "axios";
import { useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const instance = axios.create({
  baseURL: "https://api.vdsm-20h.online",
});

const useApi = () => {
  const navigate = useNavigate();
  const createMeeting = useCallback(async () => {
    try {
      const response = await instance.post("/jitsi/create");
      if (response.status === 200) {
        return response.data;
      }
    } catch (err) {
      toast.error("Can't create the meeting! Try again.");
    }
  }, []);

  const createInvite = useCallback(async (jwt) => {
    try {
      const response = await instance.post("/jitsi/invite", null, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
      return {};
    } catch (err) {
      toast.error("Can't create the invitation! Try again.");
    }
  }, []);

  const getInfoByAlias = useCallback(
    async (alias) => {
      try {
        const response = await instance.get("/jitsi/" + alias);
        if (response.status === 200) {
          return response.data;
        }
      } catch {
        toast.error("Can't join the meeting! Check the link or meeting id.");
        navigate("/", { replace: true });
      }
    },
    [navigate]
  );

  return useMemo(
    () => ({
      createMeeting,
      createInvite,
      getInfoByAlias,
    }),
    [createMeeting, createInvite, getInfoByAlias]
  );
};

export default useApi;
