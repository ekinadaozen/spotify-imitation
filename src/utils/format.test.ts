import {
  formatDuration,
  formatNumber,
  getGreeting,
  truncateText,
  getBestImage,
  formatArtists,
  stringToUuid,
} from './format';

describe('formatDuration', () => {
  it('should format 0 ms to 0:00', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('should format less than a minute correctly', () => {
    expect(formatDuration(45000)).toBe('0:45');
    expect(formatDuration(9000)).toBe('0:09');
  });

  it('should format minutes and seconds correctly', () => {
    expect(formatDuration(185000)).toBe('3:05');
    expect(formatDuration(239000)).toBe('3:59');
  });

  it('should format double digit minutes correctly', () => {
    expect(formatDuration(605000)).toBe('10:05');
    expect(formatDuration(3600000)).toBe('60:00');
  });
});

describe('formatNumber', () => {
  it('should return number as string if it is less than 1,000', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(950)).toBe('950');
  });

  it('should append K and format to 1 decimal place if between 1,000 and 1,000,000', () => {
    expect(formatNumber(1000)).toBe('1.0K');
    expect(formatNumber(1500)).toBe('1.5K');
    expect(formatNumber(99900)).toBe('99.9K');
  });

  it('should append M and format to 1 decimal place if 1,000,000 or greater', () => {
    expect(formatNumber(1000000)).toBe('1.0M');
    expect(formatNumber(2500000)).toBe('2.5M');
    expect(formatNumber(123456789)).toBe('123.5M');
  });
});

describe('getGreeting', () => {
  let getHoursSpy: jest.SpyInstance;

  beforeEach(() => {
    getHoursSpy = jest.spyOn(Date.prototype, 'getHours');
  });

  afterEach(() => {
    getHoursSpy.mockRestore();
  });

  it('should return "Good morning" if time is before 12:00', () => {
    getHoursSpy.mockReturnValue(8);
    expect(getGreeting()).toBe('Good morning');
    
    getHoursSpy.mockReturnValue(11);
    expect(getGreeting()).toBe('Good morning');
  });

  it('should return "Good afternoon" if time is between 12:00 and 18:00', () => {
    getHoursSpy.mockReturnValue(12);
    expect(getGreeting()).toBe('Good afternoon');

    getHoursSpy.mockReturnValue(15);
    expect(getGreeting()).toBe('Good afternoon');

    getHoursSpy.mockReturnValue(17);
    expect(getGreeting()).toBe('Good afternoon');
  });

  it('should return "Good evening" if time is after 18:00', () => {
    getHoursSpy.mockReturnValue(18);
    expect(getGreeting()).toBe('Good evening');

    getHoursSpy.mockReturnValue(22);
    expect(getGreeting()).toBe('Good evening');

    getHoursSpy.mockReturnValue(23);
    expect(getGreeting()).toBe('Good evening');
  });
});

describe('truncateText', () => {
  it('should not truncate if text length is less than or equal to maxLength', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
    expect(truncateText('Spotify', 7)).toBe('Spotify');
  });

  it('should truncate with ellipsis if text length is greater than maxLength', () => {
    // maxLength = 8, slices at 8 - 3 = 5 characters: "Hello" + "..." = "Hello..."
    expect(truncateText('Hello World', 8)).toBe('Hello...');
    expect(truncateText('React Native', 10)).toBe('React N...');
  });
});

describe('getBestImage', () => {
  it('should return null if images array is empty or null', () => {
    expect(getBestImage([])).toBeNull();
    expect(getBestImage(null as any)).toBeNull();
  });

  it('should return the image URL closest to the desired width', () => {
    const images = [
      { url: 'small.jpg', width: 64, height: 64 },
      { url: 'medium.jpg', width: 300, height: 300 },
      { url: 'large.jpg', width: 640, height: 640 },
    ];

    expect(getBestImage(images, 300)).toBe('medium.jpg');
    expect(getBestImage(images, 500)).toBe('large.jpg');
    expect(getBestImage(images, 80)).toBe('small.jpg');
  });

  it('should default desiredSize to 300', () => {
    const images = [
      { url: 'small.jpg', width: 64, height: 64 },
      { url: 'medium.jpg', width: 300, height: 300 },
      { url: 'large.jpg', width: 640, height: 640 },
    ];

    expect(getBestImage(images)).toBe('medium.jpg');
  });
});

describe('formatArtists', () => {
  it('should join single artist name correctly', () => {
    expect(formatArtists([{ name: 'Michael Jackson' }])).toBe('Michael Jackson');
  });

  it('should join multiple artist names with commas', () => {
    expect(
      formatArtists([{ name: 'Daft Punk' }, { name: 'Pharrell Williams' }, { name: 'Nile Rodgers' }])
    ).toBe('Daft Punk, Pharrell Williams, Nile Rodgers');
  });
});

describe('stringToUuid', () => {
  it('should return a valid UUID format string', () => {
    const result = stringToUuid('spotify:user:test');
    
    // Validate UUID format: 8-4-4-4-12 hex characters
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(result).toMatch(uuidRegex);
  });

  it('should be deterministic (same input produces same output)', () => {
    const input = '4URFZ7wZ17sc84oZ8wz69v';
    const result1 = stringToUuid(input);
    const result2 = stringToUuid(input);
    expect(result1).toBe(result2);
  });

  it('should produce different outputs for different inputs', () => {
    const result1 = stringToUuid('input-one');
    const result2 = stringToUuid('input-two');
    expect(result1).not.toBe(result2);
  });
});
