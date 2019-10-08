import Vuetify from "vuetify";
import ShrtenForm from "@/components/ShrtenForm";
import { mount, createLocalVue } from "@vue/test-utils";
import axios from "axios";
import flushPromises from "flush-promises";

let mockError = false;

jest.mock("axios", () => ({
  get: jest.fn(() => {
    if (mockError) {
      throw Error();
    } else {
      return Promise.resolve({ data: { result: { short_link: "blah" } } });
    }
  })
}));

const localVue = createLocalVue();

describe("ShrtenForm.vue", () => {
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify({
      mocks: {
        $vuetify: {
          lang: {
            t: val => val
          }
        }
      }
    });
  });

  it("calls axios once, with correct args, and stores response in 'shrtened' ", async () => {
    const wrapper = mount(ShrtenForm, {
      localVue,
      vuetify,
      directives: { intersectionObserver: {} },
      data: () => ({
        url: "testUrl"
      })
    });
    const button = wrapper.find(".v-btn");
    button.trigger("click");

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toBeCalledWith(
      `https://api.shrtco.de/v2/shorten?url=testUrl`
    );
    await flushPromises();
    expect(wrapper.vm.shrtened).toBe("blah");
    jest.clearAllMocks();
  });

  it("does not call axios when no URL input", () => {
    const wrapper = mount(ShrtenForm, {
      localVue,
      vuetify,
      data: () => ({
        url: ""
      })
    });
    const button = wrapper.find(".v-btn");
    button.trigger("click");
    expect(axios.get).toHaveBeenCalledTimes(0);
    jest.clearAllMocks();
  });

  it("displays error chip when error thrown", () => {
    const wrapper = mount(ShrtenForm, {
      localVue,
      vuetify,
      data: () => ({
        url: "testUrl"
      })
    });
    mockError = true;
    const button = wrapper.find(".v-btn");
    button.trigger("click");
    expect(wrapper.find(".error-chip").exists()).toBe(true);
    jest.clearAllMocks();
  });

  it("Shrtened url is displayed", () => {
    const wrapper = mount(ShrtenForm, {
      localVue,
      vuetify,
      data: () => ({
        shrtened: "shrtenedUrl",
        loading: false
      })
    });
    expect(wrapper.find(".url-chip").exists()).toBe(true);
    jest.clearAllMocks();
  });
});
