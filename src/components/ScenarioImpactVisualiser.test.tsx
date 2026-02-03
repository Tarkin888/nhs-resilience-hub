import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { ScenarioImpactVisualiser, ScenarioImpactVisualiserRef } from './ScenarioImpactVisualiser';
import { createRef } from 'react';
import { act } from 'react';

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

describe('ScenarioImpactVisualiser', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the visualiser header with emoji and description', () => {
      const { container } = render(<ScenarioImpactVisualiser />);
      
      expect(container.textContent).toContain('📊');
      expect(container.textContent).toContain('Scenario Impact Visualiser');
      expect(container.textContent).toContain('View how disruption cascades');
    });

    it('renders scenario dropdown', () => {
      const { container } = render(<ScenarioImpactVisualiser />);
      
      const combobox = container.querySelector('[role="combobox"]');
      expect(combobox).not.toBeNull();
    });

    it('renders Run Scenario button', () => {
      const { container } = render(<ScenarioImpactVisualiser />);
      
      const buttons = Array.from(container.querySelectorAll('button')) as HTMLButtonElement[];
      const runButton = buttons.find(btn => 
        btn.textContent?.includes('Run Scenario')
      );
      
      expect(runButton).not.toBeUndefined();
    });

    it('shows placeholder text in idle state', () => {
      const { container } = render(<ScenarioImpactVisualiser />);
      
      expect(container.textContent).toContain('Select a scenario above to see how disruption cascades');
    });
  });

  describe('Run Scenario Button', () => {
    it('is disabled when no scenario is selected', () => {
      const { container } = render(<ScenarioImpactVisualiser />);
      
      const buttons = Array.from(container.querySelectorAll('button')) as HTMLButtonElement[];
      const runButton = buttons.find(btn => 
        btn.textContent?.includes('Run Scenario')
      );
      
      expect(runButton?.disabled).toBe(true);
    });
  });

  describe('External Trigger (runScenarioById)', () => {
    it('exposes runScenarioById via ref', () => {
      const ref = createRef<ScenarioImpactVisualiserRef>();
      render(<ScenarioImpactVisualiser ref={ref} />);
      
      expect(ref.current).not.toBeNull();
      expect(typeof ref.current?.runScenarioById).toBe('function');
    });

    it('runScenarioById triggers scenario execution', () => {
      const ref = createRef<ScenarioImpactVisualiserRef>();
      const onExecutionStart = vi.fn();
      
      render(
        <ScenarioImpactVisualiser 
          ref={ref} 
          onExecutionStart={onExecutionStart}
        />
      );
      
      act(() => {
        ref.current?.runScenarioById('cyber-ransomware');
      });
      
      expect(onExecutionStart).toHaveBeenCalled();
    });

    it('shows preparing banner when triggered externally', () => {
      const ref = createRef<ScenarioImpactVisualiserRef>();
      const { container } = render(<ScenarioImpactVisualiser ref={ref} />);
      
      act(() => {
        ref.current?.runScenarioById('cyber-ransomware');
      });
      
      expect(container.textContent).toContain('Executing scenario');
    });

    it('handles invalid scenario IDs gracefully', () => {
      const ref = createRef<ScenarioImpactVisualiserRef>();
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      render(<ScenarioImpactVisualiser ref={ref} />);
      
      act(() => {
        ref.current?.runScenarioById('invalid-scenario-id');
      });
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Scenario not found'));
      
      consoleSpy.mockRestore();
    });
  });

  describe('Callbacks', () => {
    it('calls onExecutionEnd when animation completes', () => {
      const ref = createRef<ScenarioImpactVisualiserRef>();
      const onExecutionEnd = vi.fn();
      
      render(
        <ScenarioImpactVisualiser 
          ref={ref}
          onExecutionEnd={onExecutionEnd} 
        />
      );
      
      act(() => {
        ref.current?.runScenarioById('heatwave');
      });
      
      // Complete all animations
      act(() => {
        vi.advanceTimersByTime(15000);
      });
      
      expect(onExecutionEnd).toHaveBeenCalled();
    });
  });

  describe('State Machine Transitions', () => {
    it('shows loading state during execution', () => {
      const ref = createRef<ScenarioImpactVisualiserRef>();
      const { container } = render(<ScenarioImpactVisualiser ref={ref} />);
      
      act(() => {
        ref.current?.runScenarioById('heatwave');
      });
      
      // Advance past preparing state
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      
      expect(container.textContent).toContain('Calculating impact cascade');
    });

    it('shows results after loading completes', () => {
      const ref = createRef<ScenarioImpactVisualiserRef>();
      const { container } = render(<ScenarioImpactVisualiser ref={ref} />);
      
      act(() => {
        ref.current?.runScenarioById('heatwave');
      });
      
      // Advance past all animations
      act(() => {
        vi.advanceTimersByTime(10000);
      });
      
      expect(container.textContent).toContain('Environmental');
      expect(container.textContent).toContain('Operational');
      expect(container.textContent).toContain('Human');
      expect(container.textContent).toContain('Financial');
      expect(container.textContent).toContain('Reputational');
    });
  });
});
