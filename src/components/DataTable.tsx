import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Column {
  key: string;
  header: string;
  renderAs: 'default' | 'date' | 'currency' | 'link' | 'count' | 'list';
  sourceField?: string;
}

interface TableConfig {
  columns: Column[];
}

interface DataTableProps {
  config: TableConfig;
  rows: any[];
}

const DataTable = ({ config, rows }: DataTableProps) => {
  if (!rows || rows.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const renderCell = (row: any, column: Column) => {
    const value = row[column.key];

    if (value === null || value === undefined) return <span className="text-muted-foreground">—</span>;

    switch (column.renderAs) {
      case 'date':
        return new Date(value).toLocaleDateString();
      
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      
      case 'link':
        return (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            {value}
          </a>
        );
      
      case 'count':
        if (Array.isArray(value)) {
          return <Badge variant="secondary">{value.length} items</Badge>;
        }
        return value;
      
      case 'list':
        if (Array.isArray(value) && column.sourceField) {
          const items = value.map((item) => item[column.sourceField]).filter(Boolean);
          return items.slice(0, 3).join(', ') + (items.length > 3 ? '...' : '');
        }
        return JSON.stringify(value);
      
      default:
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Results ({rows.length} records)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {config.columns.map((col) => (
                  <TableHead key={col.key}>{col.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={idx}>
                  {config.columns.map((col) => (
                    <TableCell key={col.key}>{renderCell(row, col)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
