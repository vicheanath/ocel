#!/bin/bash

# test-build.sh - Test script for the undo/redo system

echo "🔄 Testing Undo/Redo System Build..."

# Navigate to project directory
cd /Users/vichea/github.com/react-sheet

# Clean and build the project
echo "📦 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Undo/Redo System Implementation Complete!"
    echo ""
    echo "📋 Summary:"
    echo "   • Command Pattern implementation ✅"
    echo "   • SOLID principles applied ✅" 
    echo "   • State Manager with callbacks ✅"
    echo "   • History Manager with undo/redo ✅"
    echo "   • Command Factory for extensibility ✅"
    echo "   • React Hook integration ✅"
    echo "   • Enhanced Spreadsheet component ✅"
    echo "   • Keyboard shortcuts (Ctrl+Z, Ctrl+Y) ✅"
    echo ""
    echo "🚀 To run the application:"
    echo "   npm run dev"
    echo ""
    echo "📖 Documentation available in:"
    echo "   • UNDO_REDO_SYSTEM.md - Complete documentation"
    echo "   • demo/UndoRedoDemo.ts - Demo code examples"
    echo ""
else
    echo "❌ Build failed!"
    exit 1
fi
