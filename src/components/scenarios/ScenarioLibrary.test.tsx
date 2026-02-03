import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { ScenarioLibrary } from './ScenarioLibrary';
import { scenarioCategories } from '@/lib/scenarioLibraryData';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, ...validProps } = props;
      return <div {...validProps}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ScenarioLibrary', () => {
  const mockOnRunScenario = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the library header', () => {
      const { container } = render(<ScenarioLibrary onRunScenario={mockOnRunScenario} />);
      
      expect(container.textContent).toContain('Scenario Testing Library');
      expect(container.textContent).toContain('Browse all available scenarios');
    });

    it('renders scenario categories', () => {
      const { container } = render(<ScenarioLibrary onRunScenario={mockOnRunScenario} />);
      
      const expandedCategories = scenarioCategories.filter(cat => cat.defaultExpanded);
      expandedCategories.forEach(category => {
        expect(container.textContent).toContain(category.name);
      });
    });
  });

  describe('Run Scenario Button Functionality', () => {
    it('renders Run Scenario buttons', () => {
      const { container } = render(<ScenarioLibrary onRunScenario={mockOnRunScenario} />);
      
      const buttons = Array.from(container.querySelectorAll('button')) as HTMLButtonElement[];
      const runScenarioButtons = buttons.filter(btn => 
        btn.textContent?.includes('Run Scenario')
      );
      
      expect(runScenarioButtons.length).toBeGreaterThan(0);
    });

    it('calls onRunScenario when button is clicked', () => {
      const { container } = render(<ScenarioLibrary onRunScenario={mockOnRunScenario} />);
      
      const buttons = Array.from(container.querySelectorAll('button')) as HTMLButtonElement[];
      const runScenarioButton = buttons.find(btn => 
        btn.textContent?.includes('Run Scenario')
      );
      
      if (runScenarioButton) {
        runScenarioButton.click();
        expect(mockOnRunScenario).toHaveBeenCalledTimes(1);
      }
    });

    it('shows loading state when scenario is running', () => {
      const firstScenario = scenarioCategories[0]?.scenarios[0];
      
      const { container } = render(
        <ScenarioLibrary 
          onRunScenario={mockOnRunScenario} 
          runningScenarioId={firstScenario?.id}
        />
      );
      
      expect(container.textContent).toContain('Running Scenario...');
    });

    it('disables button during execution', () => {
      const firstScenario = scenarioCategories[0]?.scenarios[0];
      
      const { container } = render(
        <ScenarioLibrary 
          onRunScenario={mockOnRunScenario} 
          runningScenarioId={firstScenario?.id}
        />
      );
      
      const buttons = Array.from(container.querySelectorAll('button')) as HTMLButtonElement[];
      const runningButton = buttons.find(btn => 
        btn.textContent?.includes('Running Scenario')
      );
      
      expect(runningButton?.disabled).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('does not allow running when already executing', () => {
      const firstScenario = scenarioCategories[0]?.scenarios[0];
      
      const { container } = render(
        <ScenarioLibrary 
          onRunScenario={mockOnRunScenario} 
          runningScenarioId={firstScenario?.id}
        />
      );
      
      const buttons = Array.from(container.querySelectorAll('button')) as HTMLButtonElement[];
      const runningButton = buttons.find(btn => 
        btn.textContent?.includes('Running Scenario')
      );
      
      if (runningButton) {
        runningButton.click();
        expect(mockOnRunScenario).not.toHaveBeenCalled();
      }
    });
  });
});
