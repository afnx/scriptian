# Scriptian

A browser app for injecting custom JavaScript at any point in the page lifecycle.

Scriptian lets you run small pieces of JS at chosen lifecycle moments (for example: before DOM is ready, after DOMContentLoaded, on window load, or on demand). It's written primarily in TypeScript.

## Features

- Inject custom JavaScript at different page lifecycle events:
  - before DOM parsing finishes
  - after DOMContentLoaded
  - on window `load`
  - on-demand / programmatic execution
- Lightweight and focused on simple script injection
- TypeScript-first codebase for safer development and tooling
- Easy to extend with additional lifecycle hooks or injection strategies

## Quick start

Clone the repo:

```bash
git clone https://github.com/afnx/scriptian.git
cd scriptian
```

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm run start
```

## Development

- The codebase is TypeScript-first.
- Run tests with:

```bash
npm run test
```

- Lint:

```bash
npm run lint
```

(Refer to package.json for exact scripts.)

## Contributing

Contributions are welcome. Please:

1. Open an issue to discuss larger changes or feature ideas.
2. Fork the repository and create a feature branch.
3. Submit a pull request with a clear description of the change.

Follow the existing code style and add tests for new functionality where appropriate.

## License

This project is licensed under the **Business Source License 1.1** - see the [LICENSE](LICENSE) file for details.

## Support

- 🐛 [Report Issues](https://github.com/afnx/scriptian/issues)
- 📧 [Contact Me](https://alifuatnumanoglu.com/contact)
- ⭐ **If this project helped you, please give it a star!**

---

<sub>Made with ❤️ by Ali Fuat Numanoglu</sub>
