import * as Y from 'yjs';
import { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';

export class SupabaseProvider {
  doc: Y.Doc;
  channel: RealtimeChannel;
  awareness: unknown; // Simplified awareness for now

  constructor(doc: Y.Doc, supabase: SupabaseClient, roomName: string) {
    this.doc = doc;
    this.channel = supabase.channel(`yjs-room-${roomName}`);
    
    // Listen to local Yjs changes and broadcast them
    this.doc.on('update', (update: Uint8Array, origin: unknown) => {
      // Don't echo updates back to the network if they came from the network
      if (origin !== this) {
        // Convert Uint8Array to Array for JSON serialization
        const payload = Array.from(update);
        this.channel.send({
          type: 'broadcast',
          event: 'yjs-update',
          payload: { update: payload }
        });
      }
    });

    // Listen to remote Yjs changes
    this.channel
      .on('broadcast', { event: 'yjs-update' }, ({ payload }) => {
        // Convert back to Uint8Array and apply
        const update = new Uint8Array(payload.update);
        Y.applyUpdate(this.doc, update, this);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully connected to real-time room:', roomName);
        }
      });
  }

  destroy() {
    this.channel.unsubscribe();
  }
}
