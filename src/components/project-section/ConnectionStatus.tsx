
import React from "react";

interface ConnectionStatusProps {
  connectionStatus: any;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ connectionStatus }) => {
  if (!connectionStatus) return null;
  
  return (
    <div className="w-full mb-6 p-4 rounded-md bg-gray-800/80 text-sm">
      <p>Connection Status: {connectionStatus.success ? '✅ Connected' : '❌ Failed'}</p>
      {connectionStatus.tables && connectionStatus.tables.projects && (
        <>
          <p>Projects Table: {connectionStatus.tables.projects.accessible ? '✅ Accessible' : '❌ Inaccessible'}</p>
          <p>Total projects in database: {connectionStatus.tables.projects.total_count}</p>
          <p>Visible projects (hidden=false): {connectionStatus.tables.projects.visible_count}</p>
        </>
      )}
      <div className="mt-2">
        <details>
          <summary className="cursor-pointer hover:text-teal-400">Sample Project Data</summary>
          {connectionStatus.tables && 
            connectionStatus.tables.projects && 
            connectionStatus.tables.projects.sample ? (
            <pre className="mt-2 text-xs bg-black/50 p-2 rounded overflow-auto max-h-60">
              {JSON.stringify(connectionStatus.tables.projects.sample, null, 2)}
            </pre>
          ) : (
            <p className="mt-2 italic text-gray-400">No sample project available</p>
          )}
        </details>
      </div>
    </div>
  );
};

export default ConnectionStatus;
