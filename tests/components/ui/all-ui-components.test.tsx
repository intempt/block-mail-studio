
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Button } from '../../../src/components/ui/button';
import { Input } from '../../../src/components/ui/input';
import { Card } from '../../../src/components/ui/card';
import { Badge } from '../../../src/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../src/components/ui/tabs';

describe('UI Components', () => {
  describe('Button', () => {
    it('renders button with text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('handles click events', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click me</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalled();
    });

    it('applies variant classes', () => {
      render(<Button variant="destructive">Delete</Button>);
      expect(screen.getByRole('button')).toHaveClass('destructive');
    });

    it('handles disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Input', () => {
    it('renders input field', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('handles value changes', () => {
      const onChange = vi.fn();
      render(<Input onChange={onChange} />);
      
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
      expect(onChange).toHaveBeenCalled();
    });

    it('supports different types', () => {
      render(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });
  });

  describe('Card', () => {
    it('renders card content', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Card className="custom-class">Content</Card>);
      expect(screen.getByText('Content').parentElement).toHaveClass('custom-class');
    });
  });

  describe('Badge', () => {
    it('renders badge with text', () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('applies variant styles', () => {
      render(<Badge variant="destructive">Error</Badge>);
      expect(screen.getByText('Error')).toHaveClass('destructive');
    });
  });

  describe('Tabs', () => {
    it('renders tabs component', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );
      
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('switches between tabs', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );
      
      fireEvent.click(screen.getByText('Tab 2'));
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });
});
