import { formatBytes, formatDate, formatTime } from '@/lib/utils';

describe('formatBytes', () => {
  it('should format bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(1073741824)).toBe('1 GB');
    expect(formatBytes(1536)).toBe('1.5 KB');
  });
});

describe('formatDate', () => {
  it('should format date correctly', () => {
    const testDate = '2024-01-15T10:30:00Z';
    const formatted = formatDate(testDate);
    expect(formatted).toMatch(/Jan 15, 2024/);
  });
});

describe('formatTime', () => {
  it('should format time correctly', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(3661)).toBe('1:01:01');
    expect(formatTime(3600)).toBe('1:00:00');
  });
});
