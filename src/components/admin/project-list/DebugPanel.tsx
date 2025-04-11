
import React from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DebugPanelProps {
  projectsCount: number;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ projectsCount }) => {
  return (
    <div className="mb-4 p-3 bg-muted/20 rounded-md border border-border/30">
      <p className="text-sm text-muted-foreground">Projects count: {projectsCount}</p>
      <details className="mt-2">
        <summary className="text-sm cursor-pointer text-primary">Debug API info</summary>
        <div className="mt-2 p-2 bg-muted/30 text-xs rounded overflow-auto max-h-60">
          <p>Supabase Connection: {supabase ? "✅ Available" : "❌ Not available"}</p>
          <button 
            onClick={async () => {
              try {
                const { data, error } = await supabase.from('projects').select('count');
                console.log("Count query:", data, error);
                toast.info(`Count result: ${JSON.stringify(data)}`);
              } catch (e) {
                console.error("Count error:", e);
              }
            }}
            className="px-2 py-1 bg-primary/20 text-primary rounded text-xs mt-1"
          >
            Test Count Query
          </button>
        </div>
      </details>
    </div>
  );
};

export default DebugPanel;
