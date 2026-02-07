import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { Eye } from 'lucide-react';
import { AddToParlayButton } from '../parlay/AddToParlayButton';
import type { EdgeWithDetails } from '../../hooks/queries/useEdges';

interface PropBoardRowActionsProps {
  edge: EdgeWithDetails;
}

export function PropBoardRowActions({ edge }: PropBoardRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <AddToParlayButton edge={edge} size="sm" />
      <Link to="/prop/$propId" params={{ propId: edge.prop.id.toString() }}>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
