import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import CourseForm from './CourseForm';
import courseStore from '../../stores/courseStore';
import authorStore from '../../stores/authorStore';
import {updateCourse} from '../../actions/courseActions';
import toastr from 'toastr';

class ManageCoursePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      course: {
        id: '',
        title: '',
        watchHref: '',
        authorId: '',
        length: '',
        category: ''
      },
      authors: authorStore.getAllAuthors(),
      errors: {},
      saving: false,
      redirectToCoursePage: false,
      redirectTo404Page: false
    };

    this.updateCourseState = this.updateCourseState.bind(this);
    this.saveCourse = this.saveCourse.bind(this);
  }

  componentDidMount() {
    const courseId = this.props.match.params.id;
    if (courseId) {
      const course = courseStore.getCourseById(courseId);
      course ? this.setState({course}) : this.setState({redirectTo404Page: true});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.course && this.props.course.id !== nextProps.course.id) {
      // Necessary to populate form when existing course is loaded directly.
      this.setState({ course: Object.assign({}, nextProps.course) });
    }
  }

  updateCourseState({ target }) {
    this.setState(prevState => {
      const course = { ...prevState.course, [target.name]: target.value };
      return { course };
    });
  }

  courseFormIsValid() {
    let formIsValid = true;
    let errors = {};

    if (this.state.course.title.length < 5) {
      errors.title = 'Title must be at least 5 characters.';
      formIsValid = false;
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  saveCourse(event) {
    event.preventDefault();

    if (!this.courseFormIsValid()) {
      return;
    }

    updateCourse(this.state.course);
    this.redirectToCoursePage();
  }

  redirectToCoursePage() {
    this.setState({ saving: false, redirectToCoursePage: true });
    toastr.success('Course saved');
  }

  render() {
    if (this.state.redirectToCoursePage) return <Redirect to={{ pathname: '/courses' }} />
    if (this.state.redirectTo404Page) return <Redirect to={{ pathName: '/404'}} />
    return (
      <div>
        <CourseForm
          authors={this.state.authors}
          onChange={this.updateCourseState}
          onSave={this.saveCourse}
          course={this.state.course}
          errors={this.state.errors}
          saving={this.state.saving}
        />
      </div>
    );
  }
}

ManageCoursePage.propTypes = {
  course: PropTypes.object,
  match: PropTypes.object
};

export default ManageCoursePage;