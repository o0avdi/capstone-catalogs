import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';

type TreeNode = {
  name: string;
  children?: TreeNode[];
};

type TreeArgs = {
  dataSource: TreeNode[];
};

const defaultData: TreeNode[] = [
  {
    name: 'Documents',
    children: [
      { name: 'Resume.pdf' },
      { name: 'Cover Letter.docx' },
    ],
  },
  {
    name: 'Pictures',
    children: [
      { name: 'Vacation.jpg' },
      { name: 'Family.jpg' },
    ],
  },
  {
    name: 'Downloads',
    children: [
      { name: 'Report.pdf' },
      { name: 'Notes.txt' },
    ],
  },
];

const deepData: TreeNode[] = [
  {
    name: 'Projects',
    children: [
      {
        name: 'Senior Capstone',
        children: [
          {
            name: 'Material Catalogue',
            children: [
              { name: 'Button' },
              { name: 'Paginator' },
              { name: 'Tree' },
            ],
          },
        ],
      },
    ],
  },
];

const meta: Meta<TreeArgs> = {
  title: 'Material/Tree',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        MatTreeModule,
        MatIconModule,
      ],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    dataSource: {
      control: 'object',
      description: 'Hierarchical data displayed by the tree.',
    },
  },
  args: {
    dataSource: defaultData,
  },
  render: (args) => ({
    props: {
      ...args,
      childrenAccessor: (node: TreeNode) => node.children ?? [],
      hasChild: (_: number, node: TreeNode) =>
        !!node.children && node.children.length > 0,
    },
    template: `
      <mat-tree
        #tree
        [dataSource]="dataSource"
        [childrenAccessor]="childrenAccessor"
      >
        <mat-tree-node
          *matTreeNodeDef="let node"
          matTreeNodePadding
        >
          {{ node.name }}
        </mat-tree-node>

        <mat-nested-tree-node
          *matTreeNodeDef="let node; when: hasChild"
        >
          <div
            class="mat-tree-node"
            matTreeNodePadding
          >
            <button
              mat-icon-button
              matTreeNodeToggle
              [attr.aria-label]="'Toggle ' + node.name"
            >
              <mat-icon>
                {{ tree.isExpanded(node) ? 'expand_more' : 'chevron_right' }}
              </mat-icon>
            </button>

            {{ node.name }}
          </div>

          <div
            [class.tree-invisible]="!tree.isExpanded(node)"
            role="group"
          >
            <ng-container matTreeNodeOutlet></ng-container>
          </div>
        </mat-nested-tree-node>
      </mat-tree>
    `,
    styles: [
      `
        .tree-invisible {
          display: none;
        }
      `,
    ],
  }),
};

export default meta;
type Story = StoryObj<TreeArgs>;

export const Default: Story = {};

export const DeepNesting: Story = {
  args: {
    dataSource: deepData,
  },
};

export const SingleNode: Story = {
  args: {
    dataSource: [
      {
        name: 'Single item',
      },
    ],
  },
};

