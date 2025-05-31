
export interface FileChange {
  type: 'added' | 'modified' | 'deleted';
  filePath: string;
  timestamp: number;
}

export class FileSystemWatcher {
  private watchers: Map<string, () => void> = new Map();
  private changeBuffer: FileChange[] = [];
  private bufferTimeout: NodeJS.Timeout | null = null;
  private callbacks: ((changes: FileChange[]) => void)[] = [];

  startWatching(directory: string = 'src'): void {
    // In a real implementation, this would use fs.watch or chokidar
    // For demo purposes, we'll simulate file watching
    console.log(`Started watching directory: ${directory}`);
    
    // Simulate periodic checks for changes
    const watcher = setInterval(() => {
      this.checkForChanges();
    }, 2000);

    this.watchers.set(directory, () => clearInterval(watcher));
  }

  stopWatching(directory?: string): void {
    if (directory) {
      const cleanup = this.watchers.get(directory);
      if (cleanup) {
        cleanup();
        this.watchers.delete(directory);
      }
    } else {
      // Stop all watchers
      this.watchers.forEach(cleanup => cleanup());
      this.watchers.clear();
    }
  }

  onFileChange(callback: (changes: FileChange[]) => void): void {
    this.callbacks.push(callback);
  }

  private checkForChanges(): void {
    // In a real implementation, this would detect actual file system changes
    // For demo, we'll occasionally trigger mock changes
    if (Math.random() < 0.1) { // 10% chance of simulated change
      const mockChange: FileChange = {
        type: 'modified',
        filePath: 'src/components/MockComponent.tsx',
        timestamp: Date.now()
      };
      
      this.bufferChange(mockChange);
    }
  }

  private bufferChange(change: FileChange): void {
    this.changeBuffer.push(change);
    
    // Clear existing timeout
    if (this.bufferTimeout) {
      clearTimeout(this.bufferTimeout);
    }
    
    // Set new timeout to process changes
    this.bufferTimeout = setTimeout(() => {
      this.processBufferedChanges();
    }, 500); // Process changes after 500ms of inactivity
  }

  private processBufferedChanges(): void {
    if (this.changeBuffer.length === 0) return;
    
    const changes = [...this.changeBuffer];
    this.changeBuffer = [];
    
    // Notify all callbacks
    this.callbacks.forEach(callback => {
      try {
        callback(changes);
      } catch (error) {
        console.error('Error in file change callback:', error);
      }
    });
  }

  // Mock method to simulate file changes for demo
  simulateFileChange(type: 'added' | 'modified' | 'deleted', filePath: string): void {
    const change: FileChange = {
      type,
      filePath,
      timestamp: Date.now()
    };
    
    this.bufferChange(change);
  }
}

export const fileSystemWatcher = new FileSystemWatcher();
