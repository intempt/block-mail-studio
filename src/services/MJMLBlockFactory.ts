
import { EmailBlock, TextBlock, ImageBlock, ButtonBlock, VideoBlock, SocialBlock, DividerBlock, SpacerBlock, ColumnsBlock } from '@/types/emailBlocks';

export class MJMLBlockFactory {
  static blockToMJML(block: EmailBlock): string {
    switch (block.type) {
      case 'text':
        return this.textBlockToMJML(block as TextBlock);
      case 'image':
        return this.imageBlockToMJML(block as ImageBlock);
      case 'button':
        return this.buttonBlockToMJML(block as ButtonBlock);
      case 'video':
        return this.videoBlockToMJML(block as VideoBlock);
      case 'social':
        return this.socialBlockToMJML(block as SocialBlock);
      case 'divider':
        return this.dividerBlockToMJML(block as DividerBlock);
      case 'spacer':
        return this.spacerBlockToMJML(block as SpacerBlock);
      case 'columns':
        return this.columnsBlockToMJML(block as ColumnsBlock);
      default:
        return `<!-- Unsupported block type: ${block.type} -->`;
    }
  }

  private static textBlockToMJML(block: TextBlock): string {
    const styling = block.styling.desktop;
    return `
      <mj-text
        font-size="${styling.fontSize || '14px'}"
        color="${styling.textColor || '#333333'}"
        font-weight="${styling.fontWeight || '400'}"
        font-family="${styling.fontFamily || 'Arial, sans-serif'}"
        line-height="${styling.lineHeight || '1.6'}"
        align="${styling.textAlign || 'left'}"
        padding="${styling.padding || '10px 25px'}"
        background-color="${styling.backgroundColor || 'transparent'}"
      >
        ${block.content.html || 'Click to add text...'}
      </mj-text>
    `;
  }

  private static imageBlockToMJML(block: ImageBlock): string {
    const styling = block.styling.desktop;
    return `
      <mj-image
        src="${block.content.src || 'https://via.placeholder.com/400x200?text=Image'}"
        alt="${block.content.alt || 'Image'}"
        width="${block.content.width || '100%'}"
        align="${block.content.alignment || 'center'}"
        padding="${styling.padding || '10px 25px'}"
        background-color="${styling.backgroundColor || 'transparent'}"
        ${block.content.link ? `href="${block.content.link}"` : ''}
      />
    `;
  }

  private static buttonBlockToMJML(block: ButtonBlock): string {
    const styling = block.styling.desktop;
    const buttonStyles = this.getButtonStyles(block.content.style, block.content.size);
    
    return `
      <mj-button
        href="${block.content.link || '#'}"
        background-color="${buttonStyles.backgroundColor}"
        color="${buttonStyles.color}"
        font-size="${buttonStyles.fontSize}"
        font-weight="${buttonStyles.fontWeight}"
        border-radius="${buttonStyles.borderRadius}"
        padding="${styling.padding || '10px 25px'}"
        align="center"
      >
        ${block.content.text || 'Button Text'}
      </mj-button>
    `;
  }

  private static videoBlockToMJML(block: VideoBlock): string {
    const styling = block.styling.desktop;
    // Convert video to clickable thumbnail (email best practice)
    return `
      <mj-image
        src="${block.content.thumbnail || 'https://via.placeholder.com/400x225?text=Video+Thumbnail'}"
        alt="Video thumbnail"
        href="${block.content.videoUrl || '#'}"
        padding="${styling.padding || '10px 25px'}"
        background-color="${styling.backgroundColor || 'transparent'}"
      />
    `;
  }

  private static socialBlockToMJML(block: SocialBlock): string {
    const styling = block.styling.desktop;
    const socialElements = block.content.platforms.map(platform => `
      <mj-social-element
        name="${platform.name.toLowerCase()}"
        href="${platform.url}"
        src="${platform.icon}"
        alt="${platform.name}"
      />
    `).join('');

    return `
      <mj-social
        mode="${block.content.layout === 'vertical' ? 'vertical' : 'horizontal'}"
        padding="${styling.padding || '10px 25px'}"
        background-color="${styling.backgroundColor || 'transparent'}"
        icon-size="${block.content.iconSize || '32px'}"
      >
        ${socialElements}
      </mj-social>
    `;
  }

  private static dividerBlockToMJML(block: DividerBlock): string {
    const styling = block.styling.desktop;
    return `
      <mj-divider
        border-width="${block.content.thickness || '1px'}"
        border-style="${block.content.style || 'solid'}"
        border-color="${block.content.color || '#e0e0e0'}"
        width="${block.content.width || '100%'}"
        padding="${styling.padding || '10px 25px'}"
        background-color="${styling.backgroundColor || 'transparent'}"
      />
    `;
  }

  private static spacerBlockToMJML(block: SpacerBlock): string {
    return `
      <mj-spacer
        height="${block.content.height || '40px'}"
      />
    `;
  }

  private static columnsBlockToMJML(block: ColumnsBlock): string {
    const styling = block.styling.desktop;
    const columnElements = block.content.columns.map(column => {
      const columnBlocks = column.blocks.map(innerBlock => 
        this.blockToMJML(innerBlock)
      ).join('');

      return `
        <mj-column width="${column.width}">
          ${columnBlocks}
        </mj-column>
      `;
    }).join('');

    return `
      <mj-section
        background-color="${styling.backgroundColor || 'transparent'}"
        padding="${styling.padding || '20px 0'}"
      >
        ${columnElements}
      </mj-section>
    `;
  }

  private static getButtonStyles(style: string, size: string) {
    const baseStyles = {
      backgroundColor: '#3B82F6',
      color: 'white',
      borderRadius: '6px',
      fontWeight: '500'
    };

    const sizeStyles = {
      small: { fontSize: '12px' },
      medium: { fontSize: '14px' },
      large: { fontSize: '16px' }
    };

    const styleVariants = {
      outline: { 
        backgroundColor: 'transparent', 
        color: '#3B82F6',
        border: '2px solid #3B82F6'
      },
      text: { 
        backgroundColor: 'transparent', 
        color: '#3B82F6'
      }
    };

    return {
      ...baseStyles,
      ...sizeStyles[size] || sizeStyles.medium,
      ...(styleVariants[style] || {})
    };
  }
}
