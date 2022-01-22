import React from "react";
import { useParams } from "react-router-dom";

const Meeting = props => {
  const params = useParams();
  return (
    <div>This is meeting with id: {params.meetingId}</div>
  )
}

export default Meeting;
