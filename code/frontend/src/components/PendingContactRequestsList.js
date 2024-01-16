// path: frontend/src/components/PendingContactRequestsList.js
import React, { useEffect, useState } from "react";
import { useGetContactRequestsByContext } from "../hooks/queries/useGetContactRequestsByContext";
import { useAcceptContactRequest } from "../hooks/mutations/useAcceptContactRequest";
import { useRejectContactRequest } from "../hooks/mutations/useRejectContactRequest";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import logger from "../utils/logger";
import { useSubscription } from "@apollo/client";
import { NEW_CONTACT_REQUEST } from "../graphql/subscriptions";

const PendingContactRequestsList = () => {
  const { _id } = useSelector((state) => state.user);
  const userId = _id;
  const { t } = useTranslation();
  const { loading, error, data, refetch } = useGetContactRequestsByContext();
  const acceptContactRequestHandler = useAcceptContactRequest(userId);
  const rejectContactRequestHandler = useRejectContactRequest(userId);
  const [refreshKey, setRefreshKey] = useState(0);
  const {
    data: newContactRequestData,
    loading: newContactRequestLoading,
    error: newContactRequestError,
  } = useSubscription(NEW_CONTACT_REQUEST);

  const forceUpdate = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  useEffect(() => {
    refetch();
  }, [refreshKey, refetch]);

  if (loading || newContactRequestLoading) return <p>Loading...</p>;
  if (error || newContactRequestError) return <p>Error : {error.message} </p>;
  logger.debug(
    `newContactRequestData: ${JSON.stringify(newContactRequestData)}`
  );

  const pendingRequests = data.getContactRequestsByContext.filter(
    (request) => request.status === "pending"
  );

  if (pendingRequests.length === 0) return null;

  return (
    <div>
      <h3> {t("contactRequest")} </h3>
      <ul>
        {pendingRequests.map(({ _id, senderId, status, createdAt }) => (
          <li key={_id}>
            <p>sender: {senderId.email}</p>
            <p>status: {status}</p>
            <p>createdAt: {Date(createdAt)}</p>
            <div>
              <button
                onClick={async () => {
                  try {
                    await acceptContactRequestHandler({
                      variables: { requestId: _id },
                    });
                    forceUpdate();
                  } catch (error) {
                    logger.error("Error accepting contact request:", error);
                  }
                }}
              >
                Accept
              </button>
              <button
                onClick={async () => {
                  try {
                    await rejectContactRequestHandler({
                      variables: { requestId: _id },
                    });
                    forceUpdate();
                  } catch (error) {
                    logger.error("Error rejecting contact request:", error);
                  }
                }}
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingContactRequestsList;
