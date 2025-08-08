# Contributing to THREE.Fire

First off, thank you for considering contributing! Every contribution helps make this project better.

## How to Contribute

To ensure the quality of the codebase, we follow the "Fork & Pull Request" workflow. All changes must be submitted via a Pull Request from your own fork.

### 1. Fork the Repository

Click the "Fork" button at the top-right corner of the [main repository page](https://github.com/typeWolffo/THREE.Fire). This will create a copy of the project under your own GitHub account.

### 2. Clone Your Fork

Clone your newly created fork to your local machine:

```bash
git clone https://github.com/YOUR_USERNAME/THREE.Fire.git
cd THREE.Fire
```

### 3. Create a New Branch

Create a descriptive branch name for your changes. If you are working on an existing issue, it's a good practice to include the issue number in the branch name.

```bash
git checkout -b your-feature-or-fix-name
```

### 4. Make Your Changes

Now you can start working on your bug fix or new feature. Make sure your code follows the project's style and that you've tested your changes.

### 5. Commit and Push Your Changes

Once you are happy with your changes, commit them with a clear message and push them to your fork:

```bash
git add .
git commit -m "feat: Describe your awesome new feature"
git push origin your-feature-or-fix-name
```

### 6. Create a Pull Request

Go back to your fork on GitHub. You should see a prompt to create a new Pull Request. Click it, fill out the template with a clear description of your changes, and submit it.

That's it! The project maintainers will review your contribution, provide feedback, and merge it if everything looks good. Thank you for your effort!

## Working with TSL (Three.js Shading Language)

When working with the TSL implementation:

- **TSL files**: Located in `src/NodeFireShader.ts` and `src/NodeFire.ts`
- **Entry points**: TSL exports are available via `/tsl`, `/vanilla-tsl`, and `/react-tsl` entry points
- **Testing**: Use `npm run dev:examples-node` to test TSL functionality
- **Dependencies**: TSL requires Three.js r160+ for full compatibility

## Development Guidelines

- Always test both standard GLSL and TSL implementations
- Ensure backward compatibility when making changes
- Update documentation for any new TSL features
- Run all tests before submitting a PR
