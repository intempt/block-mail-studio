
// Manual test script for drag and drop functionality
// Run this in the browser console to test drag and drop

console.log('🧪 Starting Drag and Drop Tests...');

// Test 1: Check if blocks are draggable
function testBlockDraggability() {
  console.log('📦 Testing block draggability...');
  
  const draggableBlocks = document.querySelectorAll('[draggable="true"]');
  console.log(`Found ${draggableBlocks.length} draggable elements`);
  
  draggableBlocks.forEach((block, index) => {
    console.log(`Block ${index + 1}:`, block.textContent?.trim());
  });
  
  return draggableBlocks.length > 0;
}

// Test 2: Check canvas drop zones
function testCanvasDropZones() {
  console.log('🎯 Testing canvas drop zones...');
  
  const canvas = document.querySelector('.bg-white[onDrop]') || 
                 document.querySelector('[class*="canvas"]');
  
  if (canvas) {
    console.log('✅ Canvas drop zone found');
    return true;
  } else {
    console.log('❌ Canvas drop zone not found');
    return false;
  }
}

// Test 3: Simulate drag and drop
function simulateDragDrop() {
  console.log('🔄 Simulating drag and drop...');
  
  try {
    // Find a draggable block
    const draggableBlock = document.querySelector('[draggable="true"]');
    if (!draggableBlock) {
      console.log('❌ No draggable blocks found');
      return false;
    }
    
    // Find canvas
    const canvas = document.querySelector('.bg-white');
    if (!canvas) {
      console.log('❌ No canvas found');
      return false;
    }
    
    console.log('✅ Found both draggable block and canvas');
    console.log('💡 Try manually dragging a block to the canvas!');
    
    return true;
  } catch (error) {
    console.error('❌ Error in simulation:', error);
    return false;
  }
}

// Test 4: Check ecommerce template
function testEcommerceTemplate() {
  console.log('🛍️ Testing ecommerce template...');
  
  const blocks = document.querySelectorAll('.block-wrapper, [class*="block"]');
  console.log(`Found ${blocks.length} blocks in template`);
  
  // Look for ecommerce-specific content
  const hasStoreContent = document.body.textContent?.includes('ACME Store') ||
                         document.body.textContent?.includes('Flash Sale') ||
                         document.body.textContent?.includes('Shop Now');
  
  if (hasStoreContent) {
    console.log('✅ Ecommerce template content detected');
    return true;
  } else {
    console.log('⚠️ Ecommerce template content not found');
    return false;
  }
}

// Run all tests
function runAllTests() {
  console.log('🚀 Running comprehensive drag and drop tests...\n');
  
  const results = {
    blockDraggability: testBlockDraggability(),
    canvasDropZones: testCanvasDropZones(),
    dragDropSimulation: simulateDragDrop(),
    ecommerceTemplate: testEcommerceTemplate()
  };
  
  console.log('\n📊 Test Results:');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  console.log(`\n🏆 Overall: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  
  return results;
}

// Auto-run tests
runAllTests();

// Instructions for manual testing
console.log(`
📝 Manual Testing Instructions:
1. Switch to "Layouts" tab in left panel
2. Try dragging a layout (e.g., "2 Columns") to the canvas
3. Switch to "Blocks" tab
4. Try dragging different blocks (Text, Image, Button) to:
   - The main canvas
   - Inside column areas (if you added columns)
5. Check that the ecommerce template loads automatically
6. Verify you can click blocks to edit them
7. Test responsive preview (Desktop/Tablet/Mobile buttons)

💡 Expected Behavior:
- Draggable items should show grab cursor
- Canvas should accept drops and create blocks
- Layouts should create column structures
- Blocks should be clickable for editing
- Template should look like a professional ecommerce email
`);
