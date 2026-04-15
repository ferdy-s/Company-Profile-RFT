'use client';

import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, MessageCircle, Link as LinkIcon, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareText = encodeURIComponent(title);
  const shareUrl = encodeURIComponent(url);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    whatsapp: `https://wa.me/?text=${shareText}%20${shareUrl}`,
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      <Button
        variant="outline"
        size="sm"
        asChild
        className="gap-2"
      >
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Twitter/X"
        >
          <Twitter className="h-4 w-4" />
          Twitter/X
        </a>
      </Button>
      <Button
        variant="outline"
        size="sm"
        asChild
        className="gap-2"
      >
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </a>
      </Button>
      <Button
        variant="outline"
        size="sm"
        asChild
        className="gap-2"
      >
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="gap-2"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <LinkIcon className="h-4 w-4" />
            Copy Link
          </>
        )}
      </Button>
    </div>
  );
}

