/**
 * MusicBlocks v3.6.2
 *
 * @author Test Implementation
 *
 * @copyright 2026 Test Implementation
 *
 * @license
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

const LegoWidget = require("../legobricks");

describe("LegoWidget Core Logic", () => {
    let legoWidget;

    beforeEach(() => {
        // Create a new LegoWidget instance for each test
        legoWidget = new LegoWidget();
    });

    describe("_calculateFallbackFrequency", () => {
        /**
         * Test the frequency calculation method with known pitch references.
         * This method calculates frequency for pitch names and octaves as fallback
         * when noteToFrequency is not available.
         */

        it("should return 440 Hz for A4 (standard reference pitch)", () => {
            const frequency = legoWidget._calculateFallbackFrequency("A", 4);
            expect(frequency).toBeCloseTo(440.0, 1);
        });

        it("should return 440 Hz for la4 (solfege equivalent)", () => {
            const frequency = legoWidget._calculateFallbackFrequency("la", 4);
            expect(frequency).toBeCloseTo(440.0, 1);
        });

        it("should return correct frequencies for all letter names in octave 4", () => {
            // Test all pitch names with their known frequencies in octave 4
            expect(legoWidget._calculateFallbackFrequency("C", 4)).toBeCloseTo(261.63, 1);
            expect(legoWidget._calculateFallbackFrequency("D", 4)).toBeCloseTo(293.66, 1);
            expect(legoWidget._calculateFallbackFrequency("E", 4)).toBeCloseTo(329.63, 1);
            expect(legoWidget._calculateFallbackFrequency("F", 4)).toBeCloseTo(349.23, 1);
            expect(legoWidget._calculateFallbackFrequency("G", 4)).toBeCloseTo(392.0, 1);
            expect(legoWidget._calculateFallbackFrequency("A", 4)).toBeCloseTo(440.0, 1);
            expect(legoWidget._calculateFallbackFrequency("B", 4)).toBeCloseTo(493.88, 1);
        });

        it("should return correct frequencies for all solfege names in octave 4", () => {
            // Test all solfege names with their known frequencies in octave 4
            expect(legoWidget._calculateFallbackFrequency("do", 4)).toBeCloseTo(261.63, 1);
            expect(legoWidget._calculateFallbackFrequency("re", 4)).toBeCloseTo(293.66, 1);
            expect(legoWidget._calculateFallbackFrequency("mi", 4)).toBeCloseTo(329.63, 1);
            expect(legoWidget._calculateFallbackFrequency("fa", 4)).toBeCloseTo(349.23, 1);
            expect(legoWidget._calculateFallbackFrequency("sol", 4)).toBeCloseTo(392.0, 1);
            expect(legoWidget._calculateFallbackFrequency("la", 4)).toBeCloseTo(440.0, 1);
            expect(legoWidget._calculateFallbackFrequency("ti", 4)).toBeCloseTo(493.88, 1);
        });

        it("should handle case insensitivity correctly", () => {
            // Test that case doesn't matter for pitch names
            expect(legoWidget._calculateFallbackFrequency("c", 4)).toBeCloseTo(261.63, 1);
            expect(legoWidget._calculateFallbackFrequency("C", 4)).toBeCloseTo(261.63, 1);
            expect(legoWidget._calculateFallbackFrequency("DO", 4)).toBeCloseTo(261.63, 1);
            expect(legoWidget._calculateFallbackFrequency("Do", 4)).toBeCloseTo(261.63, 1);
        });

        it("should calculate correct frequencies for different octaves", () => {
            // Test octave calculation - each octave doubles/halves the frequency
            const c4 = legoWidget._calculateFallbackFrequency("C", 4);
            const c5 = legoWidget._calculateFallbackFrequency("C", 5);
            const c3 = legoWidget._calculateFallbackFrequency("C", 3);

            expect(c5).toBeCloseTo(c4 * 2, 1); // One octave up = double frequency
            expect(c3).toBeCloseTo(c4 / 2, 1); // One octave down = half frequency
        });

        it("should handle edge cases for octaves", () => {
            // Test with very high and low octaves
            expect(legoWidget._calculateFallbackFrequency("A", 0)).toBeCloseTo(27.5, 1); // Very low octave
            expect(legoWidget._calculateFallbackFrequency("A", 8)).toBeCloseTo(7040.0, 1); // Very high octave
        });

        it("should fallback to C frequency for invalid pitch names", () => {
            // Test that invalid pitch names fallback to C frequency
            const invalidPitchFreq = legoWidget._calculateFallbackFrequency("X", 4);
            const c4Freq = legoWidget._calculateFallbackFrequency("C", 4);
            expect(invalidPitchFreq).toBeCloseTo(c4Freq, 1);
        });

        it("should handle empty and null pitch names", () => {
            // Test edge cases with empty and null inputs
            const emptyFreq = legoWidget._calculateFallbackFrequency("", 4);
            const c4Freq = legoWidget._calculateFallbackFrequency("C", 4);
            expect(emptyFreq).toBeCloseTo(c4Freq, 1);
        });
    });

    describe("addRowBlock", () => {
        /**
         * Test the row block management method.
         * This method handles insertion of row blocks with duplicate handling.
         */

        beforeEach(() => {
            // Reset the internal state before each test
            legoWidget.clearBlocks();
        });

        it("should add a new row block correctly", () => {
            // Test basic insertion functionality
            legoWidget.addRowBlock(100);

            expect(legoWidget._rowBlocks).toEqual([100]);
            expect(legoWidget._rowMap).toEqual([0]);
            expect(legoWidget._rowOffset).toEqual([0]);
        });

        it("should handle multiple unique row blocks", () => {
            // Test adding multiple different blocks
            legoWidget.addRowBlock(100);
            legoWidget.addRowBlock(200);
            legoWidget.addRowBlock(300);

            expect(legoWidget._rowBlocks).toEqual([100, 200, 300]);
            expect(legoWidget._rowMap).toEqual([0, 1, 2]);
            expect(legoWidget._rowOffset).toEqual([0, 0, 0]);
        });

        it("should handle duplicate row blocks by adding 1000000", () => {
            // Test duplicate handling logic
            legoWidget.addRowBlock(100);
            legoWidget.addRowBlock(100); // Duplicate

            expect(legoWidget._rowBlocks).toEqual([100, 1000000 + 100]);
            expect(legoWidget._rowMap).toEqual([0, 1]);
            expect(legoWidget._rowOffset).toEqual([0, 0]);
        });

        it("should handle multiple duplicates correctly", () => {
            // Test multiple duplicates of the same block
            legoWidget.addRowBlock(100);
            legoWidget.addRowBlock(100); // First duplicate
            legoWidget.addRowBlock(100); // Second duplicate

            expect(legoWidget._rowBlocks).toEqual([100, 1000000 + 100, 2000000 + 100]);
            expect(legoWidget._rowMap).toEqual([0, 1, 2]);
            expect(legoWidget._rowOffset).toEqual([0, 0, 0]);
        });

        it("should maintain correct rowMap indices", () => {
            // Test that rowMap correctly tracks indices
            legoWidget.addRowBlock(100);
            legoWidget.addRowBlock(200);
            legoWidget.addRowBlock(100); // Duplicate

            expect(legoWidget._rowMap).toEqual([0, 1, 2]);
            expect(legoWidget._rowMap[0]).toBe(0); // First block at index 0
            expect(legoWidget._rowMap[1]).toBe(1); // Second block at index 1
            expect(legoWidget._rowMap[2]).toBe(2); // Third block at index 2
        });

        it("should initialize rowOffset to 0 for all blocks", () => {
            // Test that all rowOffset values start at 0
            legoWidget.addRowBlock(100);
            legoWidget.addRowBlock(200);
            legoWidget.addRowBlock(100); // Duplicate

            expect(legoWidget._rowOffset).toEqual([0, 0, 0]);
            expect(legoWidget._rowOffset.every(offset => offset === 0)).toBe(true);
        });
    });

    describe("clearBlocks", () => {
        /**
         * Test the internal state reset method.
         * This method clears all block references and resets tracking arrays.
         */

        beforeEach(() => {
            // Set up some initial state before each test
            legoWidget.addRowBlock(100);
            legoWidget.addRowBlock(200);
            legoWidget.addRowBlock(100); // Duplicate
        });

        it("should clear all internal arrays", () => {
            // Test that all arrays are emptied
            legoWidget.clearBlocks();

            expect(legoWidget._rowBlocks).toEqual([]);
            expect(legoWidget._rowMap).toEqual([]);
            expect(legoWidget._rowOffset).toEqual([]);
        });

        it("should reset arrays to empty state", () => {
            // Test that arrays are truly empty, not just cleared references
            legoWidget.clearBlocks();

            expect(legoWidget._rowBlocks.length).toBe(0);
            expect(legoWidget._rowMap.length).toBe(0);
            expect(legoWidget._rowOffset.length).toBe(0);
        });

        it("should be safe to call multiple times", () => {
            // Test that calling clearBlocks multiple times doesn't cause errors
            legoWidget.clearBlocks();
            legoWidget.clearBlocks();
            legoWidget.clearBlocks();

            expect(legoWidget._rowBlocks).toEqual([]);
            expect(legoWidget._rowMap).toEqual([]);
            expect(legoWidget._rowOffset).toEqual([]);
        });

        it("should allow adding blocks after clearing", () => {
            // Test that the widget can be used normally after clearing
            legoWidget.clearBlocks();

            // Should be able to add blocks normally after clearing
            legoWidget.addRowBlock(300);

            expect(legoWidget._rowBlocks).toEqual([300]);
            expect(legoWidget._rowMap).toEqual([0]);
            expect(legoWidget._rowOffset).toEqual([0]);
        });

        it("should maintain array types after clearing", () => {
            // Test that arrays maintain their correct types
            legoWidget.clearBlocks();

            expect(Array.isArray(legoWidget._rowBlocks)).toBe(true);
            expect(Array.isArray(legoWidget._rowMap)).toBe(true);
            expect(Array.isArray(legoWidget._rowOffset)).toBe(true);
        });
    });

    describe("Integration Tests", () => {
        /**
         * Test the interaction between the three methods.
         */

        it("should work together: add, clear, and add again", () => {
            // Test complete workflow
            // Add some blocks
            legoWidget.addRowBlock(100);
            legoWidget.addRowBlock(200);
            expect(legoWidget._rowBlocks).toHaveLength(2);

            // Clear them
            legoWidget.clearBlocks();
            expect(legoWidget._rowBlocks).toHaveLength(0);

            // Add new blocks
            legoWidget.addRowBlock(300);
            expect(legoWidget._rowBlocks).toEqual([300]);

            // Test frequency calculation still works
            const freq = legoWidget._calculateFallbackFrequency("A", 4);
            expect(freq).toBeCloseTo(440.0, 1);
        });
    });
});
