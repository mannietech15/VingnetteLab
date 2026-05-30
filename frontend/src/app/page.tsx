'use client';

import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { useState } from 'react';

const GET_WORKSPACES = gql`
  query GetWorkspaces {
    workspaces {
      id
      name
      canvases {
        id
        title
        updatedAt
      }
    }
  }
`;

const CREATE_WORKSPACE = gql`
  mutation CreateWorkspace($name: String!) {
    createWorkspace(name: $name) {
      id
      name
      canvases {
        id
      }
    }
  }
`;

const CREATE_CANVAS = gql`
  mutation CreateCanvas($workspaceId: ID!, $title: String!) {
    createCanvas(workspaceId: $workspaceId, title: $title) {
      id
      title
      workspaceId
    }
  }
`;

export default function Dashboard() {
  const { data, loading, error, refetch } = useQuery(GET_WORKSPACES);
  const [createWorkspace] = useMutation(CREATE_WORKSPACE);
  const [createCanvas] = useMutation(CREATE_CANVAS);
  const [newWsName, setNewWsName] = useState('');

  if (loading) return <div style={{ padding: '40px', color: 'var(--text-primary)' }}>Loading Workspaces...</div>;
  if (error) return <div style={{ padding: '40px', color: 'red' }}>Error: {error.message}</div>;

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    await createWorkspace({ variables: { name: newWsName } });
    setNewWsName('');
    refetch();
  };

  const handleCreateCanvas = async (workspaceId: string) => {
    const title = prompt('Enter canvas title:');
    if (!title) return;
    await createCanvas({ variables: { workspaceId, title } });
    refetch();
  };

  return (
    <main style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-primary)' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Dashboard</h1>
          </header>

      <section style={{ marginBottom: '40px' }}>
        <form onSubmit={handleCreateWorkspace} style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="New Workspace Name..." 
            value={newWsName}
            onChange={(e) => setNewWsName(e.target.value)}
            style={{ 
              padding: '10px 16px', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)',
              background: 'var(--glass-bg)',
              color: 'var(--text-primary)',
              flex: 1
            }}
          />
          <button type="submit" style={{
            padding: '10px 24px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--accent-primary)',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Create Workspace
          </button>
        </form>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {(data as any)?.workspaces?.map((ws: any) => (
          <div key={ws.id} className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 600 }}>{ws.name}</h2>
              <button 
                onClick={() => handleCreateCanvas(ws.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                + New Canvas
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {ws.canvases.map((canvas: any) => (
                <Link key={canvas.id} href={`/canvas/${canvas.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '24px',
                    borderRadius: '8px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, borderColor 0.2s',
                    height: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)', fontSize: '18px' }}>{canvas.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                      Updated: {new Date(Number(canvas.updatedAt) || canvas.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
              {ws.canvases.length === 0 && (
                <p style={{ color: 'var(--text-secondary)' }}>No canvases yet. Create one!</p>
              )}
            </div>
          </div>
        ))}
        </div>
      </div>
    </main>
  );
}
