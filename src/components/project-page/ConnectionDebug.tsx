
import React from "react";

interface ConnectionDebugProps {
  connectionStatus: any;
}

const ConnectionDebug: React.FC<ConnectionDebugProps> = ({ connectionStatus }) => {
  if (!connectionStatus) return null;
  
  return (
    <div className="mt-6 p-4 rounded-md bg-muted/20 text-sm">
      <p>Connection Status: {connectionStatus.success ? '✅ Connected' : '❌ Failed'}</p>
      {connectionStatus.tables && connectionStatus.tables.projects && (
        <p>Projects Table: {connectionStatus.tables.projects.accessible ? '✅ Accessible' : '❌ Inaccessible'}</p>
      )}
      <details>
        <summary className="cursor-pointer text-primary hover:underline">View Details</summary>
        <pre className="mt-2 p-2 bg-muted/30 overflow-auto text-xs rounded">
          {JSON.stringify(connectionStatus, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default ConnectionDebug;
