import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleDirectories: ['node_modules', 'src', "<rootDir>/src"],
    roots: ['<rootDir>/test']
};

export default config;