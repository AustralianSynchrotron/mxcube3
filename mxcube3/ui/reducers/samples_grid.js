export default (state={ samples_list: {}, filter_text: "", login_data: {} }, action) => {
    switch (action.type) {
    case "UPDATE_SAMPLES":
          // should have session samples
          return Object.assign({}, state, { samples_list: action.samples_list });
    case "TOGGLE_SELECTED":
      {
          // Creating a new SampleItem with the "selected" state toggled
          let sample_item = {};
          sample_item[action.index] = Object.assign({}, state.samples_list[action.index], {selected : !state.samples_list[action.index].selected}  );

          // Creating new Samplelist
          let samples_list = Object.assign({}, state.samples_list, sample_item);

          return Object.assign({}, state, {samples_list: samples_list});
      }
    case "SELECT_ALL":
      { 
          // Creating a new SampleList with the "selected" state toggled to "true"
          let samples_list = {};
          Object.keys(state.samples_list).forEach(function (key) {
              samples_list[key] = Object.assign({}, state.samples_list[key], {selected : true}  );
          });

          return Object.assign({}, state,  {samples_list: samples_list}); 
      }
    case "FILTER":
      {
          return Object.assign({}, state, { filter_text: action.filter_text });
      }
    case "SET_SAMPLES_INFO":
      {
          let samples_list = {};
          Object.keys(state.samples_list).forEach(key => {
              let sample = state.samples_list[key];
              let sample_info;
              for (sample_info of action.sample_info_list) {
                  if (sample_info.code) {
                      // find sample with data matrix code
                      if (sample.code == sample_info.code) {
                          samples_list[key] = Object.assign({}, sample, { sample_info: sample_info });
                          break;
                      }
                  } else {
                      // check with sample changer location
                      let lims_location = sample_info.containerSampleChangerLocation+":"+sample_info.sampleLocation;
                      if (sample.location == lims_location) { 
                          samples_list[key] = Object.assign({}, sample, { sample_info: sample_info });
                          break;
                      }
                  }
              }    
              if (samples_list[key] === undefined) {
                  samples_list[key] = Object.assign({}, sample, { sample_info: null });
              }
          });
          return Object.assign({}, state, { samples_list: samples_list });
      }
    case "ADD_METHOD":
      {
        //Checking if methods exist on the sample and adding the new method
        let methods = (state.samples_list[action.index].methods ? [...state.samples_list[action.index].methods, {name: action.method.name}] : [{name: action.method.name}]);

        // Creating a new SampleItem with the new method attached
        let sample_item = {};
        sample_item[action.index] = Object.assign({}, state.samples_list[action.index], {methods : methods} );

        // Creating new Samplelist
        let samples_list = Object.assign({}, state.samples_list, sample_item);
        
        return Object.assign({}, state, {samples_list: samples_list});
      }
    default:
        return state
    }
}