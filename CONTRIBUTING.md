# Contributing to windows-cpu
If you have any changes, additions, or want to clean up here and there, please feel free to do so. Fork this repository, make your changes and submit a pull request. There are a few guidelines to take into account before submitting.

## Documentation
Make sure to write JSDoc3 style documentation above each method. It should follow what is already written in windows-cpu. This will maintain a good documentation set for developers.

Make sure to update the README.md file with your changed/new documentation.

## Tests
Make sure to write tests for any new functionality and update tests for any changed functionality. Tests are written in Mocha and Chai.

Please run the tests before submitting your pull request to ensure everything is running correctly.

## Different Platforms
Since this can and may act differently on different versions of Windows, please keep in mind that new or changed functionality either needs to be tested and confirmed work on the various versions or I may delay your pull request until it's fully tested. Luckily, most of this can be tested through the CI.

## Contributors
If you are contributing to this project, feel free to add yourself to the contributors section of the package.json. Since open source is very important to me, I think everyone should be recognized, even for the smallest changes.

## Nit-picky Code Styles
I'm usually lenient on coding style as long as it is efficient and still readable. So please do not leave a mess! There are a few things I am trying to stick with for readability and debugging purposes.
