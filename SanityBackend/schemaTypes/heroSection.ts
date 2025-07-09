import { defineField, defineType } from 'sanity';

const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'images',
      title: 'Background Images',
      description: 'Upload multiple images for the background slideshow. Images will cycle automatically.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(10).warning('Consider using 3-5 images for optimal performance'),
    }),
    defineField({
      name: 'slideshowSettings',
      title: 'Slideshow Settings',
      description: 'Configure the behavior and appearance of the background slideshow',
      type: 'object',
      fields: [
        defineField({
          name: 'enableSlideshow',
          title: 'Enable Slideshow',
          description: 'Toggle to enable or disable the background slideshow animation',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'overlayColor',
          title: 'Overlay Color',
          description: 'Choose the color for the overlay on background images (hex format, e.g., #000000)',
          type: 'string',
          initialValue: '#000000',
          validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
            name: 'hex color',
            invert: false
          }).error('Please enter a valid hex color (e.g., #000000 or #000)'),
          options: {
            list: [
              { title: 'Black', value: '#000000' },
              { title: 'Dark Gray', value: '#333333' },
              { title: 'Gray', value: '#666666' },
              { title: 'Light Gray', value: '#999999' },
              { title: 'White', value: '#ffffff' },
              { title: 'Dark Blue', value: '#1e3a8a' },
              { title: 'Blue', value: '#3b82f6' },
              { title: 'Dark Green', value: '#166534' },
              { title: 'Green', value: '#22c55e' },
              { title: 'Dark Red', value: '#991b1b' },
              { title: 'Red', value: '#ef4444' },
              { title: 'Orange', value: '#f97316' },
              { title: 'Purple', value: '#8b5cf6' },
            ]
          }
        }),
        defineField({
          name: 'overlayOpacity',
          title: 'Overlay Opacity (%)',
          description: 'Control the transparency of the colored overlay on background images (0-100%)',
          type: 'number',
          initialValue: 50,
          validation: (Rule) => Rule.min(0).max(100).integer(),
          options: {
            list: [
              { title: '0%', value: 0 },
              { title: '10%', value: 10 },
              { title: '20%', value: 20 },
              { title: '30%', value: 30 },
              { title: '40%', value: 40 },
              { title: '50%', value: 50 },
              { title: '60%', value: 60 },
              { title: '70%', value: 70 },
              { title: '80%', value: 80 },
              { title: '90%', value: 90 },
              { title: '100%', value: 100 }
            ]
          }
        }),
        defineField({
          name: 'transitionDuration',
          title: 'Transition Duration (seconds)',
          description: 'How long each image displays before transitioning to the next',
          type: 'number',
          initialValue: 3,
          validation: (Rule) => Rule.min(1).max(10).integer(),
          options: {
            list: [
              { title: '1 second', value: 1 },
              { title: '2 seconds', value: 2 },
              { title: '3 seconds', value: 3 },
              { title: '4 seconds', value: 4 },
              { title: '5 seconds', value: 5 },
              { title: '6 seconds', value: 6 },
              { title: '7 seconds', value: 7 },
              { title: '8 seconds', value: 8 },
              { title: '9 seconds', value: 9 },
              { title: '10 seconds', value: 10 }
            ]
          }
        }),
        defineField({
          name: 'enableZoomEffect',
          title: 'Enable Zoom Effect',
          description: 'Add a subtle zoom-in animation to each background image',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'enableFadeTransition',
          title: 'Enable Fade Transition',
          description: 'Use fade effect when transitioning between images',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showNavigationDots',
          title: 'Show Navigation Dots',
          description: 'Display navigation dots for manual image selection (desktop only)',
          type: 'boolean',
          initialValue: true,
        }),
      ],
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),
    defineField({
      name: 'welcomeText',
      title: 'Welcome Text',
      description: 'Main welcome message displayed prominently in the hero section',
      type: 'string',
      validation: (Rule) => Rule.required().max(100).warning('Keep welcome text concise for better readability'),
      initialValue: 'Welcome to Intelli Global Conferences'
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle Text',
      description: 'Descriptive subtitle text displayed below the main welcome text',
      type: 'text',
      validation: (Rule) => Rule.max(200).warning('Keep subtitle concise for better readability'),
      initialValue: 'A NEVER-ENDING JOURNEY OF SEEKING KNOWLEDGE - WITH PEOPLE AND THEIR THOUGHTS THAT ENABLE A BETTER LIVING'
    }),
    defineField({
      name: 'textColor',
      title: 'Welcome Text Color',
      description: 'Color for the welcome text (with transparency support)',
      type: 'color',
      options: {
        disableAlpha: false
      },
      initialValue: {
        hex: '#ffffff',
        alpha: 1
      }
    }),
    defineField({
      name: 'primaryButton',
      title: 'Primary Button',
      description: 'Main call-to-action button configuration',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Button Text',
          type: 'string',
          validation: (Rule) => Rule.required().max(30),
          initialValue: 'View All Conferences'
        }),
        defineField({
          name: 'url',
          title: 'Button URL',
          type: 'url',
          validation: (Rule) => Rule.required(),
          initialValue: '/conferences'
        })
      ],
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),
    defineField({
      name: 'secondaryButton',
      title: 'Secondary Button',
      description: 'Secondary call-to-action button configuration',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Button Text',
          type: 'string',
          validation: (Rule) => Rule.required().max(30),
          initialValue: 'Contact Us'
        }),
        defineField({
          name: 'url',
          title: 'Button URL',
          type: 'url',
          validation: (Rule) => Rule.required(),
          initialValue: '/contact'
        })
      ],
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),
  ],
  preview: {
    select: {
      images: 'images',
      welcomeText: 'welcomeText',
      enableSlideshow: 'slideshowSettings.enableSlideshow',
      overlayColor: 'slideshowSettings.overlayColor.hex',
      overlayOpacity: 'slideshowSettings.overlayOpacity',
      transitionDuration: 'slideshowSettings.transitionDuration',
      primaryButtonText: 'primaryButton.text',
      secondaryButtonText: 'secondaryButton.text'
    },
    prepare(selection) {
      const { images, welcomeText, enableSlideshow, overlayColor, overlayOpacity, transitionDuration, primaryButtonText, secondaryButtonText } = selection;
      const count = images?.length || 0;
      const overlayInfo = overlayColor && overlayOpacity ? ` | Overlay: ${overlayColor} (${overlayOpacity}%)` : '';
      const timingInfo = transitionDuration ? ` | ${transitionDuration}s` : '';
      const buttonsInfo = primaryButtonText && secondaryButtonText ? ` | Buttons: ${primaryButtonText}, ${secondaryButtonText}` : '';

      return {
        title: welcomeText || `Hero Section (${count} image${count !== 1 ? 's' : ''})`,
        subtitle: enableSlideshow ? `Slideshow enabled${timingInfo}${overlayInfo}${buttonsInfo}` : `Slideshow disabled${buttonsInfo}`,
        media: images?.[0]
      };
    },
  },
});

export default heroSection;
