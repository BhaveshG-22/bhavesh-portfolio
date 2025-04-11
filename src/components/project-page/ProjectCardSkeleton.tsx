
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectCardSkeleton: React.FC = () => (
  <Card className="border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden h-full">
    <Skeleton className="h-48 w-full bg-muted/50" />
    <CardHeader>
      <Skeleton className="h-6 w-3/4 bg-muted/50 mb-2" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 bg-muted/50 rounded-full" />
        <Skeleton className="h-5 w-16 bg-muted/50 rounded-full" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full bg-muted/50 mb-2" />
      <Skeleton className="h-4 w-5/6 bg-muted/50 mb-2" />
      <Skeleton className="h-4 w-4/6 bg-muted/50 mb-6" />
      <div className="flex gap-4">
        <Skeleton className="h-5 w-20 bg-muted/50" />
        <Skeleton className="h-5 w-16 bg-muted/50" />
      </div>
    </CardContent>
  </Card>
);

export default ProjectCardSkeleton;
