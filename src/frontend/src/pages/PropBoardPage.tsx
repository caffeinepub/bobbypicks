import { useState } from 'react';
import { useEdges } from '../hooks/queries/useEdges';
import { LoadingState } from '../components/loading/LoadingState';
import { ErrorState } from '../components/error/ErrorState';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ValueBar } from '../components/props/ValueBar';
import { PropBoardRowActions } from '../components/props/PropBoardRowActions';
import { ConfidenceBadge } from '../components/props/ConfidenceBadge';
import { isHighConfidence } from '../lib/verification/highConfidence';
import { ShowLogic } from '../components/props/ShowLogic';

export default function PropBoardPage() {
  const { data: edges, isLoading, error } = useEdges();
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return <LoadingState message="Loading prop board..." />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!edges || edges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">No Props Available</h2>
          <p className="text-muted-foreground max-w-md">
            There are currently no props with edge opportunities. Check back later or refresh the
            data from Settings.
          </p>
        </div>
      </div>
    );
  }

  // Filter edges by search query (case-insensitive)
  const filteredEdges = edges.filter((edge) => {
    const query = searchQuery.toLowerCase();
    return (
      edge.prop.playerName.toLowerCase().includes(query) ||
      edge.prop.team.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prop Board</h1>
        <p className="text-muted-foreground mt-1">
          Searchable table of all edge opportunities with value bars and transparency
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by player name or team..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Value Bar</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEdges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No props match your search criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredEdges.map((edge) => {
                const highConfidence = isHighConfidence(edge.verification);
                return (
                  <>
                    <TableRow
                      key={edge.prop.id.toString()}
                      className={highConfidence ? 'bg-accent/5' : ''}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {edge.prop.playerName}
                          {highConfidence && <ConfidenceBadge size="sm" />}
                        </div>
                      </TableCell>
                      <TableCell>{edge.prop.team}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="capitalize">
                            {edge.prop.statCategory.toString().replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {edge.prop.sport.toString().toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ValueBar
                          confidenceScore={edge.verification?.confidenceScore || null}
                          edgePercentage={edge.edge.edgePercentage}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <PropBoardRowActions edge={edge} />
                      </TableCell>
                    </TableRow>
                    <TableRow className={highConfidence ? 'bg-accent/5' : ''}>
                      <TableCell colSpan={5} className="p-0">
                        <ShowLogic edge={edge} />
                      </TableCell>
                    </TableRow>
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {filteredEdges.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {filteredEdges.length} of {edges.length} props
        </p>
      )}
    </div>
  );
}
