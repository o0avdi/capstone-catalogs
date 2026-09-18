import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

type StepperOrientation = 'horizontal' | 'vertical';

type StepperArgs = {
  orientation: StepperOrientation;
  linear: boolean;
  selectedIndex: number;
  firstStepCompleted: boolean;
  secondStepCompleted: boolean;
  secondStepOptional: boolean;
  onSelectionChange: (index: number) => void;
};

const meta: Meta<StepperArgs> = {
  title: 'Material/Stepper',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MatStepperModule, MatButtonModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Direction in which the steps are arranged.',
    },
    linear: {
      control: 'boolean',
      description: 'Whether each step must be completed in order.',
    },
    selectedIndex: {
      control: { type: 'number', min: 0, max: 2, step: 1 },
      description: 'Zero-based index of the active step.',
    },
    firstStepCompleted: {
      control: 'boolean',
      description: 'Whether the campaign settings step is complete.',
    },
    secondStepCompleted: {
      control: 'boolean',
      description: 'Whether the ad group step is complete.',
    },
    secondStepOptional: {
      control: 'boolean',
      description: 'Whether the ad group step may be skipped.',
    },
    onSelectionChange: {
      control: false,
      description: 'Story callback receiving the newly selected step index.',
    },
  },
  args: {
    orientation: 'horizontal',
    linear: false,
    selectedIndex: 0,
    firstStepCompleted: false,
    secondStepCompleted: false,
    secondStepOptional: false,
    onSelectionChange: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StepperArgs>();

    return {
      props: {
        ...args,
        handleSelectionChange: (index: number) => {
          args.onSelectionChange(index);
          updateArgs({ selectedIndex: index });
        },
      },
      template: `
        <div style="max-width: 1000px;">
          <mat-stepper
            #stepper
            [orientation]="orientation"
            [linear]="linear"
            [selectedIndex]="selectedIndex"
            (selectionChange)="handleSelectionChange($event.selectedIndex)"
          >
            <mat-step
              label="Select campaign settings"
              [completed]="firstStepCompleted"
            >
              <h3>Campaign settings</h3>
              <p>Choose the campaign goal, audience, budget, and schedule.</p>

              <div style="height: 120px; margin: 20px 0; border-radius: 4px; background: #e0e0e0;"></div>

              <button mat-flat-button matStepperNext>Continue</button>
              <button mat-button type="button">Cancel</button>
            </mat-step>

            <mat-step
              label="Create an ad group"
              [completed]="secondStepCompleted"
              [optional]="secondStepOptional"
            >
              <h3>Ad group</h3>
              <p>Organize related ads and define their targeting.</p>

              <div style="margin-top: 20px;">
                <button mat-button matStepperPrevious>Back</button>
                <button mat-flat-button matStepperNext>Continue</button>
              </div>
            </mat-step>

            <mat-step label="Create an ad">
              <h3>Create an ad</h3>
              <p>Add the final creative content and review the campaign.</p>

              <div style="margin-top: 20px;">
                <button mat-button matStepperPrevious>Back</button>
                <button mat-flat-button type="button">Finish</button>
                <button mat-button type="button" (click)="stepper.reset()">
                  Reset
                </button>
              </div>
            </mat-step>
          </mat-stepper>
        </div>
      `,
    };
  },
};

export default meta;
type Story = StoryObj<StepperArgs>;

export const HorizontalStepper: Story = {};

export const VerticalStepper: Story = {
  args: {
    orientation: 'vertical',
  },
};

export const SecondStepActive: Story = {
  args: {
    selectedIndex: 1,
    firstStepCompleted: true,
  },
};

export const CompletedWorkflow: Story = {
  args: {
    selectedIndex: 2,
    firstStepCompleted: true,
    secondStepCompleted: true,
  },
};

//user cannot continue from Step 1 until firstStepCompleted is set to true
export const LinearStepper: Story = {
  args: {
    linear: true,
  },
};
