
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useUserRole } from '@/hooks/useUserRole';
import { useAIPredictions } from '@/hooks/useAIPredictions';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Home, 
  Wrench, 
  DollarSign, 
  MessageSquare, 
  Loader2,
  Copy,
  Download,
  Sparkles
} from 'lucide-react';

const GenerativeAITools = () => {
  const { isAdmin, isLandlord, isVendor, isTenant } = useUserRole();
  const { generateContent } = useAIPredictions();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Role-specific templates
  const getTemplates = () => {
    const templates = [];
    
    if (isAdmin()) {
      templates.push(
        { id: 'system-report', label: 'System Report', icon: FileText, prompt: 'Generate a comprehensive system performance report' },
        { id: 'user-communication', label: 'User Communication', icon: MessageSquare, prompt: 'Draft a platform-wide announcement' },
        { id: 'policy-document', label: 'Policy Document', icon: FileText, prompt: 'Create a new platform policy document' }
      );
    }
    
    if (isLandlord()) {
      templates.push(
        { id: 'property-listing', label: 'Property Listing', icon: Home, prompt: 'Create an attractive property listing description' },
        { id: 'lease-agreement', label: 'Lease Agreement', icon: FileText, prompt: 'Generate a standard lease agreement template' },
        { id: 'tenant-notice', label: 'Tenant Notice', icon: MessageSquare, prompt: 'Draft a professional notice to tenants' },
        { id: 'maintenance-schedule', label: 'Maintenance Schedule', icon: Wrench, prompt: 'Create a preventive maintenance schedule' }
      );
    }
    
    if (isVendor()) {
      templates.push(
        { id: 'work-proposal', label: 'Work Proposal', icon: FileText, prompt: 'Generate a detailed work proposal and quote' },
        { id: 'service-description', label: 'Service Description', icon: Wrench, prompt: 'Create professional service descriptions' },
        { id: 'invoice-template', label: 'Invoice Template', icon: DollarSign, prompt: 'Generate a professional invoice template' },
        { id: 'completion-report', label: 'Completion Report', icon: FileText, prompt: 'Create a work completion report' }
      );
    }
    
    if (isTenant()) {
      templates.push(
        { id: 'maintenance-request', label: 'Maintenance Request', icon: Wrench, prompt: 'Help me write a clear maintenance request' },
        { id: 'landlord-communication', label: 'Landlord Message', icon: MessageSquare, prompt: 'Draft a professional message to my landlord' },
        { id: 'complaint-letter', label: 'Complaint Letter', icon: FileText, prompt: 'Write a formal complaint letter' },
        { id: 'lease-inquiry', label: 'Lease Inquiry', icon: Home, prompt: 'Create questions about lease terms' }
      );
    }
    
    return templates;
  };

  const templates = getTemplates();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a prompt to generate content.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await generateContent(prompt, 'CONTENT_GENERATION', {
        userRole: isAdmin() ? 'admin' : isLandlord() ? 'landlord' : isVendor() ? 'vendor' : 'tenant',
        template: selectedTemplate
      });
      
      setGeneratedContent(result.generated_content);
      
      toast({
        title: "Content Generated",
        description: "AI has generated your requested content.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template.id);
    setPrompt(template.prompt);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied",
      description: "Content copied to clipboard.",
    });
  };

  const downloadContent = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-content-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Templates Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Quick Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate === template.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <template.icon className="h-4 w-4 text-purple-600" />
                  </div>
                  <h4 className="font-medium">{template.label}</h4>
                </div>
                <p className="text-sm text-gray-600">{template.prompt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Content Generation */}
      <Card>
        <CardHeader>
          <CardTitle>AI Content Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Describe what you want to generate:
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here... Be specific about what you need."
              rows={4}
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={loading || !prompt.trim()}
            className="w-full bg-purple-500 hover:bg-purple-600"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>

          {/* Generated Content */}
          {generatedContent && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Generated Content:</h4>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadContent}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {generatedContent}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">💡 Tips for Better Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium mb-2">Be Specific:</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• Include context and details</li>
                <li>• Specify tone and style</li>
                <li>• Mention target audience</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">Use Templates:</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• Start with pre-built templates</li>
                <li>• Customize as needed</li>
                <li>• Save time and ensure quality</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerativeAITools;
