import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Search, FileText, Code, Globe, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

const ToolsPanel = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <aside 
        className={cn(
          "fixed right-0 top-0 h-full w-80 bg-sidebar-bg border-l border-sidebar-border z-50",
          "transform transition-transform duration-300 ease-in-out",
          "lg:relative lg:transform-none lg:w-96",
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Wrench className="w-4 h-4 text-secondary-foreground" />
              </div>
              <h2 className="font-medium text-foreground">Tools</h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Tools Coming Soon</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Search, code execution, file analysis and more tools will be available here.
              </p>

              {/* Preview of upcoming tools */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                <ToolPreview icon={<Search className="w-4 h-4" />} label="Web Search" />
                <ToolPreview icon={<Code className="w-4 h-4" />} label="Code Runner" />
                <ToolPreview icon={<FileText className="w-4 h-4" />} label="File Analysis" />
                <ToolPreview icon={<Globe className="w-4 h-4" />} label="Web Browse" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <p className="text-xs text-muted-foreground text-center">
              Tools panel • Reserved for future features
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

const ToolPreview = ({ icon, label }) => {
  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border opacity-60">
      <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
};

export default ToolsPanel;
